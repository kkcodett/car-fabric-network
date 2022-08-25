/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}
//모두 공용
type Car struct {
	CID string `json:"cid"`        			//차 아이디
	Company string `json:"company"`			//만든 회사
	Model string    `json:"model"`			//모델명
	CDay  int `json:"cday"`					//출고일
	FValue    int `json:"fvalue"`				//출고가
	Board string `json:"board"`              //번호판 번호
	Value int `json:"value"`    			//현재가
}

//제조사-공무원, 제조사-딜러 전용
type Register struct {
	Owner     string `json:"owner"`			//등록자 이름
	Address string    `json:"address"`		//등록자 집주소
	ID  int `json:"id"`						//등록자 주민등록번호
	RDay   int `json:"rday"`				//등록일자
	CID string `json:"cid"`       			//차 아이디
	CRDay int `json:"crday"`       			//차 등록일
}

//공무원-보험사 전용
type Accident struct {
	AID string `json:"aid"`       	 //사건 아이디
	APart string `json:"apart"`		//사고부위
	Dod int `json:"dod`				//사고정도 1~10
	ADay int `json:"aday"`			//사고날짜
}

//보험사-수리점 전용
type Insurance struct {
	IName string `json:"iname"`      	//보험 가입자 이름
	ICompany string `json:"icompany"`	//보험회사명
	IID string `json:"iid"`     		 //보험 처리 일련번호
	AID string `json:"aid"`       		 //사건 아이디
	IDay int `json:"iday"`				//보험처리일시
	IPrice int `json:"iprice"`    		 //보험사 지급비용
}

//수리점-딜러 전용
type Repair struct {
	RID string `json:rid"`       //수리건 일련번호
	CID string `json:"cid"`        //차 아이디
	Part string `json:"part"`       //고장부위
	Price int `json:"price"`		//수리비
	Message string `json:"message"`	//수리자 메모
}

//차 존재여부
func (s *SmartContract) ExistsCar(ctx contractapi.TransactionContextInterface, cid string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(cid)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//사람 존재여부
func (s *SmartContract) ExistsOwner(ctx contractapi.TransactionContextInterface, owner string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(owner)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//수리 존재여부
func (s *SmartContract) ExistsRepair(ctx contractapi.TransactionContextInterface, rid string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(rid)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//사고 존재여부
func (s *SmartContract) ExistsAccident(ctx contractapi.TransactionContextInterface, aid string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(aid)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//보험 존재여부
func (s *SmartContract) ExistsInsurance(ctx contractapi.TransactionContextInterface, iname string, icompany string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(iname)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil

	assetJSON, err := ctx.GetStub().GetState(icompany)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//자동차 등록
func (s *SmartContract) RegisterCar(ctx contractapi.TransactionContextInterface, cid string, company string, model string, cday int, fvalue int) error {

	//차 존재하는지 알림
	exists, err := s.ExistsCar(ctx, caddress)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the car %s already exists", cid)
	}

	//여기부터 등록
	car := Car{
		CID:             cid,
		Company:         company,
		Model:           model,
		CDay:          	cday,
		FValue: 		fvalue,
	}
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cid, assetJSON)
}

//자동차 정보 조회
func (s *SmartContract) InfoCar(ctx contractapi.TransactionContextInterface, cid string) (*Car, error) {
	assetJSON, err := ctx.GetStub().GetState(cid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the car %s does not exist", cid)
	}

	var car Car
	err = json.Unmarshal(assetJSON, &car)
	if err != nil {
		return nil, err
	}

	return &car, nil
}

//자동차 거래가격 갱신
func (s *SmartContract) AddCar(ctx contractapi.TransactionContextInterface, cid string, nvalue int) error {

	car, err := s.InfoCar(ctx, cid)
	if err != nil {
		return err
	}

	car.Value = value
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cid, assetJSON)
}

//운전 면허 등록
func (s *SmartContract) OwnerRegister(ctx contractapi.TransactionContextInterface, owner string, address string, id int, rday int) error {
	exists, err := s.ExistsOwner(ctx, owner)
	//등록확인
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the owner %s does not exist", owner)
	}

	//면허 등록
	register := Register{
		Owner:             owner,
		Address:			address,
		ID:					id,
		RDay:				rday,
	}
	assetJSON, err := json.Marshal(register)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(owner, assetJSON)
}

//새로운 차주 등록
func (s *SmartContract) NewOwner(ctx contractapi.TransactionContextInterface, cid string, owner string, address string, id string, rday int, crday int) error {

	exists, err := s.ExistsCar(ctx, cid)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the car %s already exists", cid)
	}

	exists, err := s.ExistsCar(ctx, owner)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the owner %s already exists", owner)
	}

	car := Car{
		CID:             cid,
		Owner:          owner,
		Address:        address,
		ID:          id,
		RDay: 		rday,
		CRDay: 		crday,
	}

	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(owner, assetJSON)
}

//차주 신원 조회
func (s *SmartContract) OwnerRead(ctx contractapi.TransactionContextInterface, id string) (*Register, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the ID %s does not exist", id)
	}

	var register Register
	err = json.Unmarshal(assetJSON, &register)
	if err != nil {
		return nil, err
	}

	return &car, nil
}

//차주 갱신
func (s *SmartContract) UpdateNewOwner(ctx contractapi.TransactionContextInterface, id string, cid string, crday int) error {
	asset, err := s.OwnerRead(ctx, id)
	if err != nil {
		return err
	}

	register.CID = cid
	register.CRDay = crday
	assetJSON, err := json.Marshal(register)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

//차 수리 등록
func (s *SmartContract) RepairRegister(ctx contractapi.TransactionContextInterface, rid string, cid string, part string, message string) error {
	exists, err := s.ExistsCar(ctx, cid)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("this car %s does not exist", cid)
	}

	// overwriting original asset with new asset
	repair := Repair{
		RID:             rid,
		CID:			cid,
		Part:					part,
		Price:				price,
		Message:		message,
	}
	assetJSON, err := json.Marshal(repair)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(rid, assetJSON)
}

//보험 처리 등록
func (s *SmartContract) InsuranceRegister(ctx contractapi.TransactionContextInterface, iname string, icompany string, iid string, aid string, iday int, iprice int) error {
	//보험 유무 확인
	exists, err := s.ExistsCar(ctx, iname, icompany)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the insurance %s does not exist", iname, icompany)
	}

	//보험 처리
	insurance := Insurance{
		IName:					iname,
		ICompany:				icompany,
		IID:             iid,
		AID:			aid,
		IDay:		iday,
		IPrice:     iprice,
	}

	assetJSON, err := json.Marshal(insurance)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(iid, assetJSON)
}

//자동차 고장 부위 조회
func (s *SmartContract) PartCar(ctx contractapi.TransactionContextInterface, rid string) (part string, error) {
	assetJSON, err := ctx.GetStub().GetState(rid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the repair %s does not exist", rid)
	}

	var repair Repair
	err = json.Unmarshal(assetJSON, &part)
	if err != nil {
		return nil, err
	}

	return &part, nil
}

//자동차 수리점 메모 조회
func (s *SmartContract) GetCar(ctx contractapi.TransactionContextInterface, rid string) (message string, error) {
	assetJSON, err := ctx.GetStub().GetState(rid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the repair %s does not exist", rid)
	}

	var repair Repair
	err = json.Unmarshal(assetJSON, &message)
	if err != nil {
		return nil, err
	}

	return &message, nil
}

//자동차 수리비용 업로드(보험사)
func (s *SmartContract) PriceCar(ctx contractapi.TransactionContextInterface, iname string, icompany string, iid string, iprice int) error {

	exists, err := s.ExistsInsurance(ctx, iname, icompany)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the insurance %s already exists", iname, icompany)
	}

	insurance := Insurance{
		IName:             iname,
		ICompany:		icompany,
		IID:			iid,
		IPrice:			iprice,
	}
	assetJSON, err := json.Marshal(insurance)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(iid, assetJSON)
}

//자동차 수리 비용 확인(보험사)
func (s *SmartContract) OkCar(ctx contractapi.TransactionContextInterface, iid string) (iprice int, error) {
	assetJSON, err := ctx.GetStub().GetState(iid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the insuranceID %s does not exist", iid)
	}

	var insurance Insurance
	err = json.Unmarshal(assetJSON, &iprice)
	if err != nil {
		return nil, err
	}

	return &iprice, nil
}

//자동차 수리비용 업로드(딜러)
func (s *SmartContract) PriceCar(ctx contractapi.TransactionContextInterface, rid string, price int) error {

	exists, err := s.ExistsRepair(ctx, rid)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the repair %s already exists", rid)
	}

	repair := Repair{
		RID:             rid,
		CID:			cid,
		Part:					part,
		Price:				price,
		Message:		message,
	}
	assetJSON, err := json.Marshal(repair)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(rid, assetJSON)
}

//자동차 폐차
func (s *SmartContract) RemoveCar(ctx contractapi.TransactionContextInterface, cid string) error {
	exists, err := s.ExistsCar(ctx, cid)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the car %s does not exist", cid)
	}

	return ctx.GetStub().DelState(cid)
}

//자동차 사고 정보 등록
func (s *SmartContract) ReportCar(ctx contractapi.TransactionContextInterface, aid string, apart string, dod int, aday int) error {

	exists, err := s.ExistsAccident(ctx, aid)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the accident %s already exists", aid)
	}

	accident := Accident{
		AID:             aid,
		APart:          apart,
		Dod:           dod,
		ADay:          aday,
	}
	assetJSON, err := json.Marshal(accident)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(aid, assetJSON)
}

//자동차 번호판 등록
func (s *SmartContract) NumberCar(ctx contractapi.TransactionContextInterface, cid string, board string) error {

	exists, err := s.ExistsCar(ctx, cid)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the car %s already exists", cid)
	}

	car := Car{
		CID:             cid,
		Board:          board,
	}
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cid, assetJSON)
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create cfn chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting cfn chaincode: %s", err.Error())
	}
}

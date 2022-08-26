/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
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
	FValue    int `json:"fvalue"`			//출고가
	Board string `json:"board"`             //번호판 번호
	Value int `json:"value"`    			//현재가
	ID     string `json:"id"`				//등록자 주민등록번호
	CRDay int `json:"crday"`       			//차 등록일
}

//제조사-공무원, 제조사-딜러 전용
type Register struct {
	Owner     string `json:"owner"`			//등록자 이름
	Address string    `json:"address"`		//등록자 집주소
	ID  string `json:"id"`					//등록자 주민등록번호
	RDay   int `json:"rday"`				//등록일자
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

//테스트(인보크)
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	cars := []Car{
		{CID: "HHDD", Company: "hyundai", Model: "porter", CDay: 200222, FValue: 300, Board: "32C22", Value: 300, ID:"0", CRDay:0},
		{CID: "KKIIAA", Company: "kia", Model: "k5", CDay: 220222, FValue: 400, Board: "11C11", Value: 400, ID:"0", CRDay:0}, 
		{CID: "BBMMWW", Company: "bmw", Model: "seires3", CDay: 210131, FValue: 500, Board: "33A55", Value: 500, ID:"0", CRDay:0},
		{CID: "BBZZ", Company: "benz", Model: "s580", CDay: 210305, FValue: 600, Board: "75S65", Value: 600, ID:"0", CRDay:0},
		{CID: "TTLL", Company: "tasla", Model: "t10", CDay: 220406, FValue: 700, Board: "58W65", Value: 700, ID:"0", CRDay:0},
		{CID: "AADD", Company: "audi", Model: "a6", CDay: 200202, FValue: 800, Board: "55V99", Value: 800, ID:"0", CRDay:0},
	}

	for _, car := range cars {
		assetJSON, err := json.Marshal(car)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(car.CID, assetJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

//테스트2(쿼리)
func (s *SmartContract) GetAllCar(ctx contractapi.TransactionContextInterface) ([]*Car, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var cars []*Car
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var car Car
		err = json.Unmarshal(queryResponse.Value, &car)
		if err != nil {
			return nil, err
		}
		cars = append(cars, &car)
	}

	return cars, nil
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
func (s *SmartContract) ExistsInsurance(ctx contractapi.TransactionContextInterface, iid string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(iid)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

//자동차 등록
func (s *SmartContract) RegisterCar(ctx contractapi.TransactionContextInterface, cid string, company string, model string, cday int, fvalue int) error {

	//차 존재하는지 알림
	exists, err := s.ExistsCar(ctx, cid)
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
		CDay:          	 cday,
		FValue: 		 fvalue,
		Board:			"0",
		Value:			0,
		ID:				"0",
		CRDay:			0,
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
func (s *SmartContract) AddCar(ctx contractapi.TransactionContextInterface, cid string, value int) error {

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
func (s *SmartContract) OwnerRegister(ctx contractapi.TransactionContextInterface, owner string, address string, id string, rday int) error {
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
		Owner:              owner,
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
func (s *SmartContract) NewOwner(ctx contractapi.TransactionContextInterface, cid string, id string, crday int) error {

	car, err := s.InfoCar(ctx, cid)
	if err != nil {
		return err
	}

	car.ID = id
	car.CRDay = crday
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cid, assetJSON)
	// exists, err := s.ExistsCar(ctx, cid)
	// if err != nil {
	// 	return err
	// }
	// if exists {
	// 	return fmt.Errorf("the car %s already exists", cid)
	// }

	// car := Car{
	// 	CID:            cid,
	// 	ID:          	id,
	// 	CRDay: 			crday,
	// }

	// assetJSON, err := json.Marshal(car)
	// if err != nil {
	// 	return err
	// }

	// return ctx.GetStub().PutState(cid, assetJSON)
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

	return &register, nil
}

//차주 갱신
func (s *SmartContract) UpdateNewOwner(ctx contractapi.TransactionContextInterface, cid string, id string, crday int) error {
	
	var car Car
	car.CID = cid
	car.CRDay = crday
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

//차 수리 등록
func (s *SmartContract) RepairRegister(ctx contractapi.TransactionContextInterface, rid string, cid string, part string, price int, message string) error {
	exists, err := s.ExistsCar(ctx, cid)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("this car %s does not exist", cid)
	}

	// overwriting original asset with new asset
	repair := Repair{
		RID:             	rid,
		CID:				cid,
		Part:				part,
		Price:				price,
		Message:			message,
	}
	assetJSON, err := json.Marshal(repair)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(rid, assetJSON)
}

//보험 처리 등록
func (s *SmartContract) InsuranceRegister(ctx contractapi.TransactionContextInterface, iid string, aid string, iday int) error {
	//보험 유무 확인
	exists, err := s.ExistsCar(ctx, iid)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the insurance %s does not exist", iid)
	}

	//보험 처리
	insurance := Insurance{
		IID:             		iid,
		AID:					aid,
		IDay:					iday,
		IPrice:    				0,
	}

	assetJSON, err := json.Marshal(insurance)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(iid, assetJSON)
}

//자동차 수리 정보 조회
func (s *SmartContract) GetCar(ctx contractapi.TransactionContextInterface, rid string) (*Repair, error) {
	assetJSON, err := ctx.GetStub().GetState(rid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the repair %s does not exist", rid)
	}

	var repair Repair
	err = json.Unmarshal(assetJSON, &repair)
	if err != nil {
		return nil, err
	}

	return &repair, nil
}

//보험료 업로드(보험사)
func (s *SmartContract) InsuranceCar(ctx contractapi.TransactionContextInterface, iid string, iprice int) error {

	insurance, err := s.OkCar(ctx, iid)
	if err != nil {
		return err
	}

	insurance.IPrice = iprice
	assetJSON, err := json.Marshal(insurance)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(iid, assetJSON)
	// exists, err := s.ExistsInsurance(ctx, iid)
	// if err != nil {
	// 	return err
	// }
	// if exists {
	// 	return fmt.Errorf("the insurance %s already exists", iid)
	// }

	// insurance := Insurance{
	// 	IPrice:				iprice,
	// }
	// assetJSON, err := json.Marshal(insurance)
	// if err != nil {
	// 	return err
	// }

	// return ctx.GetStub().PutState(iid, assetJSON)
}

//자동차 수리 비용 확인(보험사)
func (s *SmartContract) OkCar(ctx contractapi.TransactionContextInterface, iid string) (*Insurance, error) {
	assetJSON, err := ctx.GetStub().GetState(iid)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the insuranceID %s does not exist", iid)
	}

	var insurance Insurance
	err = json.Unmarshal(assetJSON, &insurance)
	if err != nil {
		return nil, err
	}

	return &insurance, nil
}

//자동차 수리비 정정
func (s *SmartContract) ResearchCar(ctx contractapi.TransactionContextInterface, rid string, price int) error {

	repair, err := s.GetCar(ctx, rid)
	if err != nil {
		return err
	}

	repair.Price = price
	assetJSON, err := json.Marshal(repair)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(rid, assetJSON)
}

//수리 비용 완료 처리(딜러)
func (s *SmartContract) PriceCar(ctx contractapi.TransactionContextInterface, rid string) error {

	exists, err := s.ExistsRepair(ctx, rid)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the car %s does not exist", rid)
	}

	return ctx.GetStub().DelState(rid)
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
		AID:            aid,
		APart:          apart,
		Dod:            dod,
		ADay:           aday,
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
		Board:          board,
	}
	assetJSON, err := json.Marshal(car)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cid, assetJSON)
}

//메인 함수
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

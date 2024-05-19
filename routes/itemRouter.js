import express from 'express';
import joi from 'joi';
import Item from '../schemas/itemSchema.js';

const router = express.Router();

// 이름, 스텟이 존재해야 함
const createdItemSchema = joi.object({
  item_name: joi.string().required(),
  item_stat: joi.object(),
});


// 아이템 생성
// ~/api/item [POST]
router.post('/item', async (req, res, next) => {

  try {
    // 유효성 검사
    const validation = await createdItemSchema.validateAsync(req.body);
    const { item_name, item_stat } = validation;

    // 이름이 존재하지 않을 때, 에러 메시지 전달
    if (!item_name) {
      return res
        .status(400)
        .json({ errorMessage: '필요한 데이터가 없습니다.' });
    }

    // Item 모델을 사용해, MongoDB에서 item_code 값이 가장 높은 데이터 조회
    const itemMaxCode = await Item.findOne().sort('-item_code').exec();
    // item_id 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당합니다.
    const item_code = itemMaxCode ? itemMaxCode.item_code + 1 : 1;

    // Item 모델을 이용해, 새로운 '해야할 일'을 생성합니다.
    const editItem = new Item({ item_code, item_name, item_stat });
    // 생성한 item을 MongoDB에 저장합니다.
    await editItem.save();

    // 찾은 item을 클라이언트에게 전달합니다.
    return res.status(201).json({ item: editItem });
  } catch (error) {
    // Router 다음에 있는 예외처리 미들웨어
    next(error);
  }
});

// 아이템 정보 수정
router.patch('/item/:item_code', async (req, res, next) => {
  // 목표 대상 ID값 설정
  const validation = await createdItemSchema.validateAsync(req.body);
    const { item_name, item_stat } = validation;
  const targetCode = parseInt(req.params.item_code);
  const changeData = req.body;

  // 수정하려는 아이템을 조회, 없으면 에러 메시지
  const updateItem = await Item.findOne({item_code: targetCode}).exec();
  if (!updateItem) {
    return res.status(404)    // 존재하지 않는 대상
      .json({ errorMessage: '존재하지 않는 데이터입니다.' });
  }

  // 조회된 아이템을 수정
  await Item.updateOne({item_code: targetCode}, {$set:{item_name: item_name, item_stat: item_stat}}).exec();

  return res.status(200).json({});
});

// 아이템 특정대상 조회
// ~/api/item/:item_code [GET]
router.get('/item/:item_code', async (req, res, next) => {
  // 목표 대상 ID값 설정
  const targetId = parseInt(req.params.item_code);
  
  // 대상(아이템) 조회
  const targetItem = await Item.findOne({item_code: targetId}).exec();
  if(!targetItem) {
    return res.status(404)    // 존재하지 않는 대상
      .json({ errorMessage: '존재하지 않는 대상입니다.' });
  }

  // 조회 결과 반환
  return res.status(200).json({ targetItem });
});

// 아이템 전체조회
// ~/api/item [GET]
router.get('/item', async (req, res, next) => {
  // 목록(아이템) 조회
  const itemList = await Item.find().sort('-item_name').exec();
  if(!itemList) {
    return res.status(404)    // 존재하지 않는 데이터
      .json({ errorMessage: '데이터가 없습니다.' });
  }

  // 조회 결과 반환
  return res.status(200).json({ itemList });
});



export default router;

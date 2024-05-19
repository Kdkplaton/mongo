import express from 'express';
import joi from 'joi';
import Character from '../schemas/characterSchema.js';

const router = express.Router();

// 이름, 체력, 힘이 존재해야 함
const createdCharacterSchema = joi.object({
  name: joi.string().required(),
  health: joi.number().required(),
  power: joi.number().required(),
});


// 캐릭터 생성
// ~/api/character [POST]
router.post('/character', async (req, res, next) => {

  try {
    // 유효성 검사
    const validation = await createdCharacterSchema.validateAsync(req.body);
    const { name, health, power } = validation;

    // 빈 부분이 존재할 경우, 에러 메시지 전달
    if (!name || !health || !power) {
      return res
        .status(400)
        .json({ errorMessage: '필요한 데이터가 없습니다.' });
    }

    // Character 모델을 사용해, MongoDB에서 character_id 값이 가장 높은 데이터 조회
    const characterMaxId = await Character.findOne().sort('-character_id').exec();
    // character_id 값이 가장 높은 객체(데이터)에 1을 추가하거나, 없다면 1을 할당
    const character_id = (characterMaxId ? characterMaxId.character_id + 1 : 1);

    // Character 모델을 이용해, 새로운 '해야할 일'을 생성
    const editCharacter = new Character({ character_id, name, health, power });
    // 생성한 Character를 MongoDB에 저장
    await editCharacter.save();

    // Character를 클라이언트에게 전달
    return res.status(201).json({ charcter: editCharacter });
  } catch (error) {
    // Router 다음에 있는 예외처리 미들웨어
    next(error);
  }
});

// 캐릭터 삭제
// ~/api/character/:characterId [DELETE]
router.delete('/character/:character_id', async (req, res, next) => {
  // 목표 대상 ID값 설정
  const targetId = parseInt(req.params.character_id);

  // 삭제하려는 캐릭터를 조회, 없으면 에러 메시지
  const deleteCharacter = await Character.findOne({character_id: targetId}).exec();
  if (!deleteCharacter) {
    return res.status(404)    // 존재하지 않는 대상
      .json({ errorMessage: '존재하지 않는 데이터입니다.' });
  }

  // 조회된 캐릭터를 삭제
  await Character.deleteOne({character_id: targetId}).exec();

  return res.status(200).json({});
});

// 캐릭터 특정대상 조회
// ~/api/character/:characterId [GET]
router.get('/character/:character_id', async (req, res, next) => {
  // 목표 대상 ID값 설정
  const targetId = parseInt(req.params.character_id);
  
  // 대상(캐릭터) 조회, 없으면 에러 메시지
  const targetCharacter = await Character.findOne({character_id: targetId}).exec();
  if(!targetCharacter) {
    return res.status(404)    // 존재하지 않는 대상
      .json({ errorMessage: '존재하지 않는 대상입니다.' });
  }

  // 조회 결과 반환
  return res.status(200).json({ targetCharacter });
});

// 캐릭터 전체조회
// ~/api/character [GET]
router.get('/character', async (req, res, next) => {
  // 목록(캐릭터) 조회, 없으면 에러 메시지
  const characterList = await Character.find().sort('-character_id').exec();
  if(!characterList) {
    return res.status(404)    // 존재하지 않는 대상
      .json({ errorMessage: '데이터가 없습니다.' });
  }

  // 조회 결과 반환
  return res.status(200).json({ characterList });
});

// 캐릭터 정보 수정
router.patch('/character/:character_id', async (req, res, next) => {
  // 목표 대상 ID값 설정
  const targetId = parseInt(req.params.character_id);


});

export default router;

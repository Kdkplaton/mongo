import express from 'express';
import joi from 'joi';
import Character from '../schemas/characterSchema.js';

const router = express.Router();

const createdNameSchema = joi.object({
  name: joi.string().required(),
});


// 캐릭터 생성
// ~/api/character [POST]
router.post('/character', async (req, res, next) => {

  try {
    // 유효성 검사
    const validation = await createdNameSchema.validateAsync(req.body);
    const { data } = validation;

    // data가 존재하지 않을 때, 에러 메시지 전달
    if (!data) {
      return res
        .status(400)
        .json({ errorMessage: '데이터가 존재하지 않습니다.' });
    }

    // Character 모델을 사용해, MongoDB에서 'character_id' 값이 가장 높은 데이터 조회
    const charcterMaxId = await Todo.findOne().sort('-character_id').exec();

    // 'character_id' 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당합니다.
    const id = charcterMaxId ? charcterMaxId.character_id + 1 : 1;

    // Character 모델을 이용해, 새로운 '해야할 일'을 생성합니다.
    const charcter = new Charcter({ data, character_id });

    // 생성한 '캐릭터'를 MongoDB에 저장합니다.
    await charcter.save();

    // 찾은 '캐릭터'를 클라이언트에게 전달합니다.
    return res.status(201).json({ charcter: charcter });
  } catch (error) {
    // Router 다음에 있는 예외처리 미들웨어
    next(error);
  }
});

// 캐릭터 삭제
// ~/api/character/:characterId [DELETE]
router.delete('/character/:characterId', async (req, res, next) => {
  // 삭제할 캐릭터의 ID 값을 가져옵니다.
  const { characterId } = req.params;

  // 삭제하려는 캐릭터를 조회. 만약, 해당 ID값을 가진 캐릭터가 없다면 에러 발생
  const Character = await Character.findById(characterId).exec();
  if (!Character) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 데이터입니다.' });
  }

  // 조회된 캐릭터를 삭제합니다.
  await Character.deleteOne({ _id: characterId }).exec();

  return res.status(200).json({});
});

// 캐릭터 세부조회
// ~/api/character [GET]
router.get('/character/:characterId', async (req, res, next) => {
  // 목록 조회 (캐릭터)
  const characters = await Character.findOne().sort('-character_id').exec();

  // 조회 결과 반환
  return res.status(200).json({ characters });
});


export default router;
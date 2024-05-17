
import mongoose from 'mongoose';

// 캐릭터 정보셋
const CharacterSchema = new mongoose.Schema({
  character_id: {
    type: Number,
    required: true, // ID : 필수 요소
    unique: true,   // ID : 중복 불가
  },
  name: {
    type: String,
    required: true, // 이름 : 필수 요소
    unique: true,   // 이름 : 중복 불가
  },
  health: {
    type: Number,
    required: true, // 체력 : 필수 요소
  },
  power: {
    type: Number,
    required: true, // 힘 : 필수 요소
  },
});

// CharacterSchema 바탕으로 Character 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Character', CharacterSchema);

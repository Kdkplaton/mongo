
import mongoose from 'mongoose';

// 아이템 정보셋
const ItemSchema = new mongoose.Schema({
  item_code: {
    type: Number,
    required: true, // ID : 필수 요소
    unique: true,   // ID : 중복 불가
  },
  item_name: {
    type: String,
    required: true, // 이름 : 필수 요소
  },
  item_stat: {
    type: Number,
    required: true, // 체력 : 필수 요소
  },
});

// ItemSchema 바탕으로 Item 모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Item', ItemSchema);

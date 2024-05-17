
import express from "express";
import connect from "./schemas/index.js";
import characterRouter from "./routes/characterRouter.js";
import itemRouter from "./routes/itemRouter.js";

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello, There!" });
});

// 라우터, 캐릭터-라우터, 아이템-라우터
app.use("/api", [router, characterRouter, itemRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버 열림");
});

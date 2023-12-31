const CIRCLE_ANGLE = 360;
const BIGSIZE = 24;
let data =[{ //可以随意更改獎項個數
  id:1,
  img:'',
  prize_name:"準備摺疊桌備用"
  },{
  id:2,
  img:'',
  prize_name:"板橋府中路開分店備用"
  },{
  id:3,
  img:'',
  prize_name:"萬華西門開分店備用"
  },{
  id:4,
  img:'',
  prize_name:"把隔壁間買下來擴店"
  },{
  id:5,
  img:'',
  prize_name:"竹北高鐵開分店備用"
  },{
    id:6,
    img:'',
    prize_name:"我愛米西"
    }
];
let angleList = []; // 記錄每個獎的位置
let gift_id =3; //中獎ID
let prizeList = formatPrizeList(data); //有樣式的獎品列表
let index='';//抽中的是第幾個獎品
let isRotating = false; //為了防止重複點擊
let rotateAngle = 0;
let bgDom = document.getElementsByClassName('luckWhellBgMain')[0];
let divDom = document.getElementsByClassName('prize-list')[0];
prizeAddHtml(prizeList);
//每個獎增加style
function formatPrizeList(list) {			  
  const l = list.length;
  // 計算單個獎項所佔的角度
  const average = CIRCLE_ANGLE / l; //60
  const half = average / 2; //30			  
  const rightBig = l==2?'50':'0';
  const heightBig = l<=3?'100':'50';
  const topBig = l==3?'-50':'0';
  const skewMain = l<=2?0:-(l-4)*90/l;
  // 循環計算給每個獎項添加style屬性
  list.forEach((item, i) => {
  // 每個獎項旋轉的位置為 目前 i * 平均值 + 平均值 / 2
  const angle = -(i * average + half);	
  const bigAge = l>2?i*360/l:'0';
  // 增加 style 這個是增加每個獎項的樣式
  item.style = `-webkit-transform: rotate(${-angle}deg);
          transform: rotate(${-angle}deg);
          width:${100/l*2}%;  
          margin-left: -${100/l}%;
          font-size:${BIGSIZE-l}px;`;
  // 這是給每個轉盤背景新增的樣式
  item.style2 = `-webkit-transform: rotate(${bigAge}deg);
          transform: rotate(${bigAge}deg) skewY(${skewMain}deg);
          right:${rightBig*i}%;
          height:${heightBig}%;
          top:${topBig}%;
          width:${l==1?100:50}%;
          background:${item.color}
          `
    // 記錄每個獎項的角度範圍
    angleList.push(angle);         
  });	         
  return list;
};
// 獎品賦值到每個獎品中；
function prizeAddHtml(prizeList) {
  console.log(prizeList)
  // 把獎品賦值到.luckWhellBgMain
  let htmlBg = '';
  let htmlDiv = '';
  for(let i=0,len=prizeList.length;i<len;i++){
    htmlBg+=`<div class="luckWhellSector" style="${prizeList[i].style2}"></div>`;
    htmlDiv+=`<div class="prize-item"  style="${prizeList[i].style}">							
          <div>
            ${prizeList[i].prize_name}                
          </div>	
          <div style="padding-top:5px;">
            <img src=" ${prizeList[i].img}" style="width:45%"/>
          </div>	
        </div>`
  }       
  bgDom.innerHTML= htmlBg;        
  divDom.innerHTML = htmlDiv;
};
// 抽獎
function prizeRoll() {
  if(isRotating) return false;
  gift_id = Math.floor(1+Math.random()*prizeList.length);        
  console.log(gift_id);
  prizeList.forEach((item,i)=>{
    if(item.id == gift_id) index = 1; // 判斷中獎位置
  });
  rotating();				
};
// 轉盤轉動角度
function rotating() {
  isRotating = true;
  // const {rotateAngle,angleList,config,index} = {0,angleList,{duration:5000, circle: 8,mode: "ease-in-out"},index};
    const config = {
      duration:5000, 
      circle: 8,
      mode: "ease-in-out"
    }
    // 計算角度
    const angle =
    // 初始角度
    rotateAngle +
    // 多旋轉的圈數
    config.circle * CIRCLE_ANGLE +
    // 獎項的角度
    angleList[index] -
    (rotateAngle % CIRCLE_ANGLE);
      rotateAngle = angle;
      bgDom.style.transform = `rotate(${rotateAngle}deg)`
      divDom.style.transform = `rotate(${rotateAngle}deg)`
    // 旋轉結束後，允許再次觸發
    setTimeout(() => {
      isRotating = false;
      console.log('旋轉結束')					
    }, config.duration + 500);
}			
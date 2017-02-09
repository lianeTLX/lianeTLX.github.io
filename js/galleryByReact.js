/**
 * Created by Administrator on 2017/2/7.
 */
//图片数据
var imageDatas=[
    {"fileName":"2.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"1.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"3.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"4.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"5.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"6.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"7.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"8.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"9.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"10.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"11.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"12.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"13.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"14.jpg","title":"I'm Liane~~","desc":"I come to win!"},
    {"fileName":"15.jpg","title":"I'm Liane~~","desc":"I come to win!"}
];

//得到图片路径
imageDatas=(function(imageDatasArr){
    for(var i=0;i<imageDatasArr.length;i++){
        var singleImageData=imageDatasArr[i];
        singleImageData.imageURL="images/"+singleImageData.fileName;
        imageDatasArr[i]=singleImageData;
    }

    return imageDatasArr;
})(imageDatas);
// console.log(imageDatas);

//封装一个函数，用来实现给定一个区间，取区间里的一个随机值
function getRangeRandom(low,high){
    return Math.ceil(Math.random()*(high-low)+low);
}

//封装一个函数，用来获取一个0~30度之间的任意角度值
function get30DegRandom(){
    return ((Math.random()>0.5?"":"-")+Math.ceil(Math.random()*30));
}

//单个图片小组件
var ImgFigure=React.createClass({
   /*
   * imgFigure的点击处理函数
   *
   */
    handleClick:function(e){
         if(this.props.arrange.isCenter){
             this.props.inverse();//图片为居中时，点击翻转
         }else{
             this.props.center();//图片不居中时，点击居中
         }


        e.stopPropagation();
        e.preventDefault();
    },

   render:function(){
       //得到props.arrange
       var styleObj={};
       //如果props属性中指定了这张图片的位置，则使用
       if(this.props.arrange.pos){
           styleObj=this.props.arrange.pos;
       }

       //如果图片的旋转角度有值并且不为0，添加旋转角度
       if(this.props.arrange.rotate){
           ['MozTransform','msTransform','WebkitTransform','transform'].forEach(function(value){
               styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
           }.bind(this))
       }

       if(this.props.arrange.isCenter){
           styleObj['zIndex']=11;
       }

       //通过修改图片div的class类名控制是否翻转
       var imgFigureClassName="img-figure";
       imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';

       return (<div className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
           <img src={this.props.data.imageURL} alt=""/>
           <h2 className="img-title">{this.props.data.title}</h2>
           <div className="img-back" onclick={this.handleClick}>{this.props.data.desc}</div>
       </div>);
   }
});

//控制组件
var ControllerUnit=React.createClass({

    handleClick:function(e){

        //如果点击的是当前选中态的按钮，则翻转图片，否则为居中图片
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render:function(){
        var controllerUnitClassName="controller-unit";

        //如果对应的是居中图片，则显示控制按钮的居中态
        if(this.props.arrange.isCenter){
            controllerUnitClassName+=' is-center';
            //如果同时是对应翻转图片，则显示控制按钮的翻转态
            if(this.props.arrange.isInverse){
                controllerUnitClassName +=' is-inverse';
            }
        }


        return (<span className={controllerUnitClassName} onClick={this.handleClick}></span>);
    }
});

var GalleryByReactApp=React.createClass({//掌控一切数据和数据切换
    Constant:{//用于存储图片排布可取值范围----值先初始化为0--实际值在componentDidMount中定义
        centerPos:{//中心图片位置点
            left:0,
            right:0
        },
        hPosRange:{//水平方向取值范围
            leftSecX:[0,0],//左分区x的取值范围0~0
            rightSecX:[0,0],//右分区x的取值范围0~0
            y:[0,0]
        },
        vPosRange:{//垂直方向取值范围
            x:[0,0],
            topY:[0,0]//上分区y的取值范围
        }
    },

    /*点击中心图片和控制按钮都可以控制图片翻转，因此在大组件中封装控制函数
    *设计一个闭包函数，通过闭包变量来缓存当前被执行invers操作的图片
    *index参数表示当前被执行inverse操作的图片对应的图片数组的index值
    * return 一个闭包函数，其内
     */
    inverse:function(index){
        return function(){
            var imgsArrangeArr=this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangArr:imgsArrangeArr
            })
        }.bind(this);//this指GalleryByReactApp组件
    },


    //封装一个重新布局图片的函数，centerIndex参数指定居中排布哪个图片
    rearrange:function(centerIndex){//生成随意的位置
        var imgsArrangeArr=this.state.imgsArrangeArr,
            Constant=this.Constant,//图片定位取值范围对象
            centerPos=Constant.centerPos,//中心图片定位范围
            hPosRange=Constant.hPosRange,//左右分区的图片定位范围
            vPosRange=Constant.vPosRange,//上分区的图片定位范围
            hPosRangeLeftSecX=hPosRange.leftSecX,//左分区x的取值范围
            hPosRangeRightSecX=hPosRange.rightSecX,//右分区x的取值范围
            hPosRangeY=hPosRange.y,//左右分区y的取值范围
            vPosRangeTopY=vPosRange.topY,//上分区y的取值范围
            vPosRangeX=vPosRange.x,//上分区x的取值范围

            //存储布局在上侧区域图片的定位信息--只取0个或者1个
            imgsArrangeTopArr=[],
            topImgNum=Math.floor(Math.random()*2),//上侧图片的摆放数量随机--0or1个
            topImgSpliceIndex=0,//标记上分区的图片是在数组对象中的哪个位置，先赋值为0

            //存储居中图片的状态信息--截取第centerIndex位置的1个
            imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

        imgsArrangeCenterArr[0]={
            pos:centerPos,//首先居中centerIndex的图片--只有一张图片居中
            rotate:0,//居中的centerIndex的图片不需要旋转
            isCenter:true
        };

        //取出要布局上侧的图片的状态信息
            //计算一个随机数，这个随机数用来从imgsArrangeArr中定位取出我们应该布局在上侧的图片的状态信息，取值范围是imgArrangeArr.length-topImgNum
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(v,index){
            imgsArrangeTopArr[index]={
                pos:{
                    top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                },
                rotate:get30DegRandom(),
                isCenter:false
            }
        });

        //布局左右两侧的图片
        for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
            var hPosRangeLORX=null;//声明一个临时变量，左区域或者右区域的x取值范围
            if(i<k){//前半部分布局在左边，后半部分布局在右边
                hPosRangeLORX=hPosRangeLeftSecX;
            }else{
                hPosRangeLORX=hPosRangeRightSecX;
            }

            imgsArrangeArr[i]={//当前图片的位置
                pos:{
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                },
                rotate:get30DegRandom(),
                isCenter:false
            }
        }

        //合并
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){//如果取了一张图片在上区域位置
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);//取出用于上区域的图片信息重新塞回去
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);//中心区域的图片信息塞回去

        //最后设置state,重新调用render函数，渲染DOM
        this.setState({
            imgsArrangeArr:imgsArrangeArr
        });
    },

    /*封装一个用于居中的函数
    *点击侧边图片，利用rearrange函数，居中对应index的图片
    *index参数表示当前点击图片对应在图片信息数组的index值
    * 返回一个函数
    */
    center:function(index){
        return function(){
            this.rearrange(index);
        }.bind(this);
    },

    //初始化状态
    getInitialState:function(){
        return {
            imgsArrangeArr:[//存储多个图片的状态,初始值在render函数中，遍历图片数据时定义
                /*
                {
                    pos:{//定位信息，作为css对象
                        left:0,
                        top:0
                    },
                    rotate:0, //表示图片的旋转角度
                    isInverse:false,  //表示图片正反面，false为正面
                    isCenter:false  //表示图片是否居中，false为不居中
                }，
                ...
                 */
            ]
        }
    },

    //组件加载后为每张图片计算其位置的范围
    componentDidMount:function(){//当DOM挂载完后自动执行
        //得到舞台的大小
        var stageDOM=this.refs.stage,
            stageW=$(stageDOM).width(),
            stageH=$(stageDOM).height(),
            halfStageW=Math.ceil(stageW/2),
            halfStageH=Math.ceil(stageH/2);
        //获取imgFigure的大小--todo this.refs.imgFigure0得到的是div.img-figure元素的组件，并不是div元素
        // var imgFigureDOM=this.refs.imgFigure0,
        //     imgW=$(imgFigureDOM).width(),
        //     imgH=$(imgFigureDOM).height(),
        var imgW=320,
            imgH=360,
            halfImgW=Math.ceil(imgW/2),
            halfImgH=Math.ceil(imgH/2);
        
        //计算各个Constant的值
        //计算中心图片的位置点
        this.Constant.centerPos={
            left:halfStageW-halfImgW,
            top:halfStageH-halfImgH
        };
        //计算左分区x的取值范围
        this.Constant.hPosRange.leftSecX[0]=-halfImgW;//最小取值
        this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
        //计算右分区x的取值范围
        this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
        //计算左右分区y的取值范围
        this.Constant.hPosRange.y[0]=-halfImgH;
        this.Constant.hPosRange.y[1]=stageH-halfImgH;
        //计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0]=-halfImgH;
        this.Constant.vPosRange.topY[1]=halfStageH-halfImgH*3;
        this.Constant.vPosRange.x[0]=halfStageW-imgW;
        this.Constant.vPosRange.x[1]=halfStageW;

        //指定第一张图片居中，其余重新排布
        this.rearrange(0);
    },

    //负责图片组件的定位
    render:function(){
        //包含一系列图片和控制组件
        var controllerUnits=[],//保存图片控制小圆按钮
            imgFigures=[];//保存单个图片信息小组件

        //遍历所有的图片数据
        imageDatas.forEach(function(v,index){//todo 为函数绑定this,this指GalleryByReactApp大组件
            // console.log(v);
            if(!this.state.imgsArrangeArr[index]){//如果当前没有图片状态对象
                this.state.imgsArrangeArr[index]={//则初始化当前图片的位置状态值为0--随意的定位值则在rearrange函数中定义
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }

            imgFigures.push(<ImgFigure key={index} data={v} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
            //添加索引方便之后定位imgFigure,每个ImgFigure都通过arrange这个prop值传递其定位值


            controllerUnits.push(< ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)

        }.bind(this));//todo


        return(<section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="control-nav">
                {controllerUnits}
            </nav>
        </section>);
    }

});
ReactDOM.render(<GalleryByReactApp />,document.getElementById("content"));








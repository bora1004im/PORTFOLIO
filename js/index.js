//text
const content = "web publisher + web designer = it's me!!"
const text = document.querySelector(".intro p")
let index = 0; 

function typing(){
    text.textContent += content[index++];
    if(index > content.length-1){
        clearInterval(interval)
    }
}

let interval = setInterval(typing,180);

//main svg
window.addEventListener('mousemove',function(){
    $('.intro-bg').css({marginLeft:`${event.clientX * 0.3}px`,marginTop:`${event.clientY *0.3}px`})
})

//scroll
function pageScroll(){
    let idx = $(this).index(); //메뉴의 순번을 변수로 담기
    let conTop = $('main').eq(idx).offset().top;
    const domHeight =  $('.mainall').height();
    $('html').height(domHeight);

    let offsetTop = [
        $('.intro').offset().top,
        $('.about').offset().top,
        $('.project').offset().top,
        $('.disign').offset().top,
        $('.contact').offset().top
    ];

    let i = 0, k=0, play;
    let scrollState = {y:0,y2:0,state:'down'}

    $('header div a').on('click', function(){ 
        i = $(this).index();
        // console.log(i)
        if(i>k){
            k=i; i--;
        }else{
            k=i; i++;
        }
        $(window).scrollTop($(window).height()*k);    
        update();
    });

    function update(){
        $('header div a').removeClass('active')
        $('header div a').eq(i).addClass('active')
    }

    $(window).on('scroll',function(){
        scrollState.y = $(window).scrollTop();

        if(scrollState.y > scrollState.y2){
            scrollState.state = true;  
        }else{
            scrollState.state = false;
        }
    

        clearTimeout(play);
        play = setTimeout(function(){

            if(scrollState.state){
                if(i<4) i++;
            }else{
                if(i>0) i--;
            }
            update();

            $('.mainall').css({
                transform:`translateY(-${offsetTop[i]}px)`
            });
        },50);
    
        scrollState.y2 = scrollState.y;
    })
}

//ajax
let data,dragState=true;

$.ajax({
    url:"./js/data.json",
    success:function(json){  
        data = json;

        slideList();

        $('.design-slide figure').on('click',popupShow);
        $('.design-popup').on('click',popupClose);  

        $('.project-main figure').on('click','a:first',projectShow);

        $('.popup-shodow').on('click',projectClose); 
        

        setTimeout(pageScroll,1000);
        //success end

    }
});

//slide ajax
function slideList(){
    //profect
        $.each(data.project, function(key, value){
            
            elData = 
            `<figure  data-code=${value.code}>
            <div class="right">
                <img src="${value.img}">
            </div>

            <div class="left">
                <div class="left-title">
                    <p>${value.title}</p>
                    <h2>${value.titlemain}</h2>
                    <h3>${value.titlesubmain}</h3>
                </div>
                <div class="left-txt">
                    <p>작업 기간 : <span>${value.time}</span></p>
                    <p>구성 목록 : <span>${value.make}</span></p>
                    <p>사용 프로그램 : <span>${value.progrem}</span></p>
                    <p>사용 기술: <span>${value.skill}</span></p>
                <div class="bar">
                    <p>기여도:</p>
                    <span></span>
                    <p>${value.level}</p>
                </div>
            </div>
                <div class="left-btn">
                    <a>PLANNING</a>
                    <a href = "${value.site}" target="_blank">SITE</a>
                </div>
            </div>
        </figure>`;

        $('.project-main').append(elData);

        console.log(value.code)

        if(value.code == 2){
            $('.project-main figure').eq(1).find('.left-btn a:eq(1)').on('click',handle);
        }
    })

    //design
        $.each(data.design, function(key, value){
            elData = 
            `<figure  data-code=${value.code}>
                <a><img src="${value.img}"></a>
                <div class="design-txt">
                    <span>${value.title}</span>
                    <p>${value.txt}</p>
                    <p>click</p>
                </div>
            </figure>`;
        $('.design-slide').append(elData);
    })
}

//project-popup
function projectShow(){ 
    // 클릭한 상품의 코드값을 찾기
    event.preventDefault();
    if(dragState){
        let code = $(this).parents('figure').data('code');

        // 데이터들 중에서 클릭한 상품 코드값과 같은 데이터를 찾아라!
        let p = data.project.filter(function(num){
            return num.code == code;
        });
        
        // 출력할 태그안에 값을 변경
        let elPopup;

        //할리스,포레스트
        if(p[0].overview != undefined){
            let color = p[0].color.split(',');
            let colorTag='';
            
            //color 반복문 사용
            $.each(color,function(i){
                colorTag +=`<figure>
                                <p style="background-color:${color[i]}"></p>
                                <figcaption>${color[i]}</figcaption>
                            </figure>`;
            })
            
            elPopup = 
                    `<div class="main" style="background-image:url(${p[0]['title-img']})">
                    <div class="main-txt" >
                        <h2>${p[0]['title-e']}</h2>
                        <h1>${p[0]['title-k']}</h1>
                        <p style="color:${p[0]['point-color']}">${p[0]['title-subtitle']}</p>
                        <p>${p[0]['title-concept']}</p>
                        <a href = "${p[0].site}" target="_blank" style= "color:${p[0]['point-color']}; border:1px solid ${p[0]['point-color']}">사이트 확인하기</a>
                    </div>
                </div>
        
                <div class="txt">
                    <div class="popup-right">
                        <div class="overview">
                            <h2 style="color:${p[0]['point-color']}"><i>Overview</i><hr></h2> 
                            <p>${p[0].overview}</p>
                        </div>
        
                        <div class="concept">
                            <h2 style="color:${p[0]['point-color']}"><i>Concept</i><hr></h2>
                            <p>${p[0].concept}</p>
                        </div>
        
                        <div class="color">
                            <h2 style="color:${p[0]['point-color']}"><i>Color</i><hr></h2>
                            <div class="colorall">
                                ${colorTag}
                            </div>
                        </div>
                    </div>
        
                    <div class="popup-left">
                        <div class="font">
                            <h2 style="color:${p[0]['point-color']}"><i>Font</i><hr></h2>

                            <div class="font-img">
                                <img src="${p[0].font}">
                            </div>
                        </div>

                        <div class="keyword">
                            <h2 style="color:${p[0]['point-color']}"><i>Keyword</i><hr></h2>
                            <div class="circle">
                                <figure style="border:1px solid ${p[0]['point-color']}">
                                    <p><b style="color:${p[0]['point-color']}">${p[0].keyword[0]['keyword-e']}</b></p>
                                    <span>${p[0].keyword[0]['keyword-k']}</span>
                                </figure>
        
                                <figure style="border:1px solid ${p[0]['point-color']}">
                                    <p><b style="color:${p[0]['point-color']}">${p[0].keyword[1]['keyword-e']}</b><br></p>
                                    <span>${p[0].keyword[1]['keyword-k']}</span>
                                </figure>
        
                                <figure style="border:2px dotted ${p[0]['point-color']}">
                                    <p><b style="color:${p[0]['point-color']}">${p[0].keyword[2]['keyword-e']}</b><br></p>
                                    <span>${p[0].keyword[2]['keyword-k']}</span>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mockup">
                    <img src="${p[0].mockup}">
                </div>
        
                <div class="codereview">
                    <h2 style="color:${p[0]['point-color']}"><i>Code review</i><hr></h2>
        
                    <div class="reviewall">
                        <div class="reiew">
                            <h3><b>#</b><span>${p[0]['code-review'][0]['code-name']}</span></h3>
        
                            <div class="img">
                                <p>
                                    <video autoplay loop muted width="800">
                                        <source src="${p[0].video1}" type="video/mp4">
                                    </video>
                                </p>
                                <span>${p[0]['code-review'][0]['code-txt']}</span>
                            </div>
                        </div>
        
                        <div class="reiew">
                            <h3><b>#</b><span>${p[0]['code-review'][1]['code-name']}</span></h3>
        
                            <div class="img">
                            <p>
                                <video autoplay loop muted width="800">
                                    <source src="${p[0].video2}" type="video/mp4">
                                </video>
                            </p>
                                <span>${p[0]['code-review'][1]['code-txt']}</span>
                            </div>
                        </div>
        
                        <div class="reiew">
                            <h3><b>#</b><span>${p[0]['code-review'][2]['code-name']}</span></h3>
        
                            <div class="img">
                            <p>
                                <video autoplay loop muted width="800">
                                    <source src="${p[0].video3}" type="video/mp4">
                                </video>
                            </p>
                                <span>${p[0]['code-review'][2]['code-txt']}</span>
                            </div>
                        </div>
            
                    </div>
                </div>`;
        }else{
            //셀리턴
            elPopup = 
                `<div class="main" style="background-image:url(${p[0]['title-img']})">
                <div class="main-txt" >
                    <h2>${p[0]['title-e']}</h2>
                    <h1>${p[0]['title-k']}</h1>
                    <p style="color:${p[0]['point-color']}">${p[0]['title-subtitle']}</p>
                    <p>${p[0]['title-concept']}</p>
                    <a href = "${p[0].site}" style= "color:${p[0]['point-color']}; border:1px solid ${p[0]['point-color']}">사이트 확인하기</a>
                </div>
            </div>

            <div class="codereview">
                <h2 style="color:${p[0]['point-color']}"><i>Code review</i><hr></h2>

                <div class="reviewall">
                <div class="reiew">
                    <h3><b>#</b><span>${p[0]['code-review'][0]['code-name']}</span></h3>

                    <div class="img">
                        <p>
                            <video autoplay loop muted width="600">
                                <source src="${p[0].video1}" type="video/mp4">
                            </video>
                        </p>
                        <span>${p[0]['code-review'][0]['code-txt']}</span>
                    </div>
                </div>

                <div class="reiew">
                    <h3><b>#</b><span>${p[0]['code-review'][1]['code-name']}</span></h3>

                    <div class="img">
                    <p>
                        <video autoplay loop muted width="600">
                            <source src="${p[0].video2}" type="video/mp4">
                        </video>
                    </p>
                        <span>${p[0]['code-review'][1]['code-txt']}</span>
                    </div>
                </div>

                <div class="reiew">
                    <h3><b>#</b><span>${p[0]['code-review'][2]['code-name']}</span></h3>

                    <div class="img">
                    <p>
                        <video autoplay loop muted width="600">
                            <source src="${p[0].video3}" type="video/mp4">
                        </video>
                    </p>
                        <span>${p[0]['code-review'][2]['code-txt']}</span>
                    </div>
                </div>
    
            </div>
            </div>

            <div class="mockup">
                <img src="${p[0].mockup}">
            </div>`;
        }

        // popup클래스안에 elPopup값으로 변경
        $('.popup-all').html(elPopup);
        $('.project-popup').addClass('active');
        $('header').css('display','none');
        
        //no scroll
        $('html').css('overflow','hidden');

        $('.popup-shodow').scrollTop(0);

        //cellreturn mobile popup
        if (code == 2){
            $('.main-txt a').on('click',handle);
        }


        setTimeout(()=>{
            console.log(                
                $(".main").width()
            )
            //img를 가운데 위치 
            let popupBox = $(window).height() > $(".main").height();
            if(popupBox){
                $(".popup all").css({
                    display:'flex',alignItems:'center',justifyContent:'center'
                }); 
            }else{
                $(".popup all").css({
                    display:'block'
                }); 
            }
        },10)
    }
    dragState=true;
} 

function projectClose(){ 
    if( event.target.classList.contains('popup-shodow')){
        $('.project-popup').removeClass('active');
    
        //close 했을때는 overflow scroll로 적용하기!
        $('html').css('overflow','scroll');
        $('header').css('display','block');
    }
} 

//design-popup
function popupShow(){ 
        // 클릭한 상품의 코드값을 찾기
        if(dragState){
            let code = $(this).data('code');

            // 데이터들 중에서 클릭한 상품 코드값과 같은 데이터를 찾아라!
            let p = data.design.filter(function(num){
                return num.code == code;
            });

            // 출력할 태그안에 값을 변경
            let elPopup = 
                    `<img src="${p[0].photo}">`;

            // popup클래스안에 elPopup값으로 변경
            $('.popup').html(elPopup);
            $('.design-popup').addClass('active');
            
            //no scroll
            $('html').css('overflow','hidden');
            $('header').css('display','none');

            $('.popup').scrollTop(0);

            setTimeout(()=>{
                console.log(                
                    $(".popup img").width()
                )
                //img를 가운데 위치 
                let popupBox = $(window).height() > $(".popup img").height();
                if(popupBox){
                    $(".popup").css({
                        display:'flex',alignItems:'center',justifyContent:'center'
                    }); 
                }else{
                    $(".popup").css({
                        display:'block'
                    }); 
                }
            },10)
            
        }
        dragState=true;


} 

function popupClose(){ 

        if( event.target.classList.contains('popup-shodow') || event.target.className == 'popup'){
            $('.design-popup').removeClass('active');
        
            //close 했을때는 overflow scroll로 적용하기!
            $('html').css('overflow','scroll');
            $('header').css('display','block');
        }
} 

//slide
setTimeout(function(){

    //slide-project
    $('.project-main').slick({
        slidesToShow: 1,
        slidesToScroll: 1
    });

    //기여도
    $('.project-main').on('afterChange',function(e,idx){
        let code;
        switch(idx.currentSlide){
            case 0:code='70%'; break;
            case 1:code='70%'; break;
            case 2:code='40%'; break;
            case 3:code='70%'; break;
        }


        $('.bar span').css('width','0%');
        $('.project-main .slick-active').find('.bar span').css('width',code);
        
    });


    $('.project-main .slick-active').find('.bar span').css('width','70%');

    //slide-design
    $('.design-slide').slick({
        // arrows:false,
        slidesToShow: 4,
        slidesToScroll: 1,       
        // autoplay: true,
        // autoplaySpeed: 5000
    });

    $('.design-slide').on('beforeChange',function(e){
        dragState = false;
    });
},500)


//cellrturn popup
function handle(){
    event.preventDefault();
    const windowFeatures = "left=760,top=100,width=375,height=667";
    window.open("https://bora1004im.github.io/CELLRTURN/", "_blank", windowFeatures);
}







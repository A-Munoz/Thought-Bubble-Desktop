 /* 
////////////////////////////////////////////
//Thought Bubble (Mind Mapping)
//Created: 10/22/2016 - Alexia Munoz
//Last Edit: 1/11/2018
////////////////////////////////////////////
 */
//Main JS - Main controller of app

///////////////////App Set up and Properties///////////////////////
"use strict";

var app = app || {};

app.main = {

//PROPERTIES//
    
    //Canvas Properties
    mOnCanvas: 'true',
    WIDTH: undefined,
    HEIGHT: undefined,
    canvas: undefined,
    toolState: undefined,
    ctx: undefined,
    scale: 1,
    
    music: true,
   	lastTime: 0, // used by calculateDeltaTime() 
    //debug: true,   
  //  sound:undefined,
    bColor:'#656D78',
    dt: undefined,
    bg: undefined,
    color: ["#DA4453", "#FFCE54", "#4FC1E9", "#EC87C0", "#48CFAD", "#A0D468", "#AC92EC" ], //Array of avaliable colors
    BUBBLE:Object.seal({
        radius: 60,
        increaseRate: 60,
        fColor: '#ED5565',
        sColor: '#ED5565',
        shape: 'circle', // rect, circle, trangle
        margin: 10,
        sWeight: 4,
        speed: 15,
        currentSelected: undefined,
        maxWidth: 200,
        lineHeight: 50,
    }),    
    BUBBLE_STATE:Object.freeze({
        EXPANDING: 1, //Bubble Size adjusting - Increasing
        SHRINKING:2, // Bubble Size adjusting - Decreasing
        MOVING: 3, //Bubble is Moving
        NORMAL:4   //Normal  
    }), 
    TOOL_STATE:Object.seal({
        POINTER: 1,
        NEWBUBBLE: 2,
        DELETINGBUBBLE: 3,
    }),    
    bubbles: [], //Array of Mind Map Bubbles
    animationID: 0,
    
    //Functions    
    init: function(){
        
        console.log("app.main.init() called");
        //Canvas Setup & Properties Setting
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');  
        this.resizeCanvas();
        this.toolState = this.TOOL_STATE.NEWBUBBLE;
       // this.bg = this.bColor;
       // this.bg.src = 'media/bg.png';
        
        //initalization
         this.canvas.onmousedown=this.doMouseDown.bind(this);

        //Load
       // this.sound.playBGAudio();
        this.update();
        
    },
    update: function(){
        this.animationID=requestAnimationFrame(this.update.bind(this));
               
        //Checks
         this.dt = this.calculateDeltaTime();
        
        //Collision Check
          for(var i = 0; i < this.bubbles.length; i++){
             this.collisionCheck(this.bubbles[i]); 
             this.moveBubble(this.bubbles[i]);
             this.radiusCheck(this.bubbles[i]);
             this.moveBubble(this.bubbles[i]);
   
        } 
    //DRAW SET UP
        
        // 1) BACKGROUND
            //incase of image load error
            this.resizeCanvas();
             this.ctx.fillStyle = this.bColor;
           //this.ctx.scale(this.scale,this.scale)
           //this.ctx.scale(this.scale,this.scale)
            this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
          //  this.ctx.fillRect(this.bg,0,0,this.WIDTH,this.HEIGHT); //Display image background
        
        // 3)BUBBLES!
        for(var i = 0; i < this.bubbles.length; i++){
            if(i > 0){
                 this.drawLine(this.bubbles[i],this.ctx);
             }
          
        }
        
         for(var i = 0; i < this.bubbles.length; i++){
            
             this.drawBubble(this.bubbles[i]);

        }
        
    },  
    
    resizeCanvas: function(){
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.WIDTH = window.innerWidth;
        this.HEIGHT = this.canvas.clientHeight;
        console.log(this.canvas.clientHeight);
    },

    doMouseDown: function(e){
        var mouse = getMouse(e);
        if(this.music){
        //this.sound.playEffect();
        }
         this.scale = this.scale - .1;
            console.log(this.scale)
        if(this.toolState == this.TOOL_STATE.POINTER){
            this.bubbleClickedCheck(mouse);
        }
        if(this.toolState == this.TOOL_STATE.DELETINGBUBBLE){
            this.deleteBubble(mouse);
            
        }
        if(this.toolState == this.TOOL_STATE.NEWBUBBLE){
            var newBubble = this.addBubble(mouse);
            this.bubbles.push(newBubble);
            this.bubbleClickedCheck(mouse);
            this.collisionCheck(this.bubbles[this.bubbles.length-1]);
        } 
    },    
    bubbleClickedCheck: function(mouse){
        for(var i=0; i < this.bubbles.length; i++){
            if(pointInsideCircle(mouse.x,mouse.y,this.bubbles[i])){
                this.bubbles[i].selected = true;
                this.BUBBLE.currentSelected = this.bubbles[i];
                for(var b=0; b < this.bubbles.length; b++){
                    if(!(i==b)){
                        this.bubbles[b].selected = false;
                    }
                }
                break;
            }
            this.bubbles[i].selected = false;
        }
                
    },    
    collisionCheck: function(oBubble){
        for(var i= 0; i < this.bubbles.length; i++){
            var check = this.bubbles[i];
            if(!(check == oBubble)){
                if(circlesIntersect(oBubble,check)){
                    oBubble.state = this.BUBBLE_STATE.MOVING;
                    if(oBubble.x >= check.x){
                        oBubble.xSpeed = this.BUBBLE.speed;
                    }
                    else{
                        oBubble.xSpeed = -this.BUBBLE.speed;
                    }
                     if(oBubble.y >= check.y){
                        oBubble.ySpeed = this.BUBBLE.speed;
                    }
                    else{
                        oBubble.ySpeed = -this.BUBBLE.speed;
                    }
               
                  break;  
                }
                else{
                    oBubble.state = this.BUBBLE_STATE.NORMAL;
                }
            }
        }
    },  
    calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},  
    radiusCheck: function(oBubble){
       var width = this.ctx.measureText(oBubble.text).width; 
       var bWidth = ((oBubble.radius*2)-60);
    
        if(width >= bWidth){
            oBubble.state = this.BUBBLE_STATE.EXPANDING;
       
        }
        else if(width <= bWidth){
            oBubble.state = this.BUBBLE_STATE.SHRINKING; 
        }
        else{
            oBubble.state = this.BUBBLE_STATE.NORMAL;
        }      
    },
    moveBubble: function(oBubble){
        if(oBubble.state == this.BUBBLE_STATE.EXPANDING){
            oBubble.radius += this.BUBBLE.speed*this.dt ;
    
        }
         if(oBubble.state == this.BUBBLE_STATE.SHRINKING){
            oBubble.radius -= this.BUBBLE.speed*this.dt ;


        }
        if(oBubble.state==this.BUBBLE_STATE.MOVING){
            oBubble.x += oBubble.xSpeed*this.dt;
            oBubble.y += oBubble.ySpeed*this.dt;
        }
    },   
    addText: function(oBubble, otext){
        if(oBubble.text == 'Type Here....'){ //clear default text
            oBubble.text = '';
        }
        oBubble.text += ''+ otext;
        oBubble.dRadius = (this.ctx.measureText(oBubble.text) +10);
        if(oBubble.dRadius >= (oBubble.radius*2)){
            oBubble.state = this.BUBBLE_STATE.EXPANDING;
        }
        else if(oBubble.dRadius < (oBubble.radius+2)){
            oBubble.state = this.BUBBLE_STATE.SHRINKING;
        }
    },
 /*  removeText:function(oBubble){
        var words = oBubble.text.split("");
        words.splice(-1,1);
        oBubble.text = '' + words;
        
    },*/
      addBubble: function(mouse){ //creates a new bubble object
  
        var oBubble = {};
        
        //Sets x oBubble properties
        oBubble.x = mouse.x;
        oBubble.y = mouse.y;
        oBubble.radius = this.BUBBLE.radius;
        oBubble.state = this.BUBBLE_STATE.NORMAL;
        oBubble.color = this.BUBBLE.sColor;
        oBubble.shape = this.BUBBLE.shape;
        oBubble.lineWeight = this.BUBBLE.sWeight;
        oBubble.text = 'Type Here....';
          
        //sets currently selected bubble for future connected bubbles
        if(this.bubbles.length > 0){
            if(this.BUBBLE.currentSelected == undefined){ 
                //if bubble is undefined, it pick the prevous bubble
                var selected = this.bubbles[this.bubbles.length - 1];
            }
            else {
                var selected  = this.BUBBLE.currentSelected;
            }
            //sets connections starting points
            oBubble.pX = selected.x;
            oBubble.pY = selected.y;
        }
        //return oBubble to bubbles array
        return oBubble;      
    },
    deleteBubble:function(mouse){ //removes bubbles from array if clicked on
         for(var i=0; i < this.bubbles.length; i++){
            if(pointInsideCircle(mouse.x,mouse.y,this.bubbles[i])){
                var oBubble = this.bubbles[i-1]; //resets current slected for future bubbles
               if(this.BUBBLE.currentSelected == this.bubbles[i]){
                   this.BUBBLE.currentSelected = oBubble ;
               }
               var remove = this.bubbles.splice(i, 1);
                //checks to make sure i is less then array length and i is not equal to 0
                //to prevent errors
                if(i < this.bubbles.length){
                    if(!(i==0)){ 
                        //sets new starting point for connections
                        this.bubbles[i].pX = oBubble.x;
                        this.bubbles[i].pY = oBubble.y;
                    }
                 break; 
                }
            }
        }       
    },
    //End of User Interaction Funtions///////////////////////////////////
///////////////////////////////////////////////////////////////////////////
   ///Bubble Display Functions/////////////////////////////////////////   
   drawBubble: function(oBubble){
        switch(oBubble.shape){
            case 'rect':
               this.rectBubble(oBubble,this.ctx);
                break;
            case 'circle':
              //console.log("Draw Bubble");
                this.circleBubble(oBubble,this.ctx);

                break;
            case 'triangle':
                this.trangleBubble(oBubble,this.ctx);

                break;
            default:
               this.circleBubble(oBubble,this.ctx);

                break;
            
        }    
       this.textDisplay(oBubble,this.ctx);
    },  
    textDisplay:function(oBubble,ctx){
        ctx.save();
        ctx.scale(this.scale,this.scale)
        ctx.font= "12pt Arial";
        ctx.fillStyle = "white";
        ctx.textAlign ='center';
        var text = oBubble.text;
        ctx.fillText(text,oBubble.x,oBubble.y);

        ctx.restore();
    },
    circleBubble: function(oBubble,ctx){
        ctx.save();
        ctx.scale(this.scale,this.scale)
        ctx.beginPath();
        
        ctx.arc(oBubble.x,oBubble.y,oBubble.radius,0,Math.PI*2,false);
        ctx.closePath();
        
        ctx.shadowBlur = 5;
        if(oBubble.selected){
        ctx.shadowColor = "#AAB2BD";
        }
        else {
            ctx.shadowOffsetY = 5;
            ctx.shadowColor ="#434A54"
        }
        ctx.fillStyle = oBubble.color;
        ctx.strokeStyle = oBubble.color;
        ctx.lineWidth = oBubble.lineWeight;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    },
    rectBubble: function(oBubble,ctx){
        ctx.save();
        ctx.scale(this.scale,this.scale)
        ctx.shadowBlur = 5;
        if(oBubble.selected){
        ctx.shadowColor = "#AAB2BD";
        }
        else {
            ctx.shadowOffsetY = 10;
            ctx.shadowColor ="#434A54"
        }
        ctx.fillStyle = oBubble.color;
        ctx.strokeStyle = oBubble.color;
        ctx.lineWidth = oBubble.lineWeight;
        ctx.fillRect(oBubble.x-oBubble.radius,oBubble.y-oBubble.radius,(oBubble.radius*2),(oBubble.radius*2))
        ctx.strokeRect(oBubble.x-oBubble.radius,oBubble.y-oBubble.radius,(oBubble.radius*2),(oBubble.radius*2));
        ctx.stroke();
        ctx.restore();      
    },  

    drawLine: function(oLine,ctx){
        ctx.save();
        ctx.scale(this.scale,this.scale)
        ctx.beginPath();
        ctx.strokeStyle = oLine.color;
        ctx.moveTo(oLine.pX,oLine.pY);
        ctx.lineTo(oLine.x,oLine.y);
        ctx.closePath();
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor ="#434A54"
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    },
   //End of Bubble Function //////////////////////////////// 
    
};

/*
* jQuery zSlider幻灯片插件jQuery 1.9.1
*
*使本插件，请保留版权信息,如果你修复了本插件的bug信息，请发信一份demo样本给本人.
*www.zihaidetiandi.com/zSlider
*
*Copyright (c) 2014 子海(zihaidetiandi@sina.com)
* 
*Version 1.0
*Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*Date 2014-9-26
*/
(function($,window,document,undefined){
	
	var zSlider = function (element,options){
		this.$element = element;
		this.options = $.extend(true,{
			animate: 'animate',
			direction : 'horizontal',//滚动方向,vertical重直滚动,horizontal水平滚动
			event:"mouseover",
			fadeIn_time:2000,
			fadeOut_time:2000,
			show_def_nav: true,		//是否使用默认导航
			nav_class: 'nav',
			nav_hover_color:'orange',	//导航激活之后的颜色
			nav_color:'#ffffff',				//导航默认颜色
			show_def_control : false,			//是否显示上一张下一张的控制按钮
			control_class:'control',
			title_fadeIn_time:2000,
			title_fadeOut_time:2000,
			duration: 3000,		//播放频率
			speed : 500,		//滚动速度
			auto : true						//是否自动播放
		},options);
		this.index = 0;
	}
	
	zSlider.prototype ={
		init : function(){
			var that = this;//储存slider对象
			this.item_wrap = this.$element.find('.'+this.options.item_wrap);
			this.item = this.$element.find('.'+this.options.item_class);
			this.number = this.item.length;
			this.width = $('.'+this.options.item_wrap,this.$element).first().outerWidth();
			this.height =  $('.'+this.options.item_wrap,this.$element).first().outerHeight();
			console.log(this.height);
			this.$element.css({'position':'relative'});
			this.item_wrap.css({'position':'absolute',top:'0px',left:'0px'});
			if(this.options.direction == 'horizontal' && this.options.animate == 'animate'){
				this.item_wrap.css({'width':this.width*this.number+'px'});
				this.item.css({'float':'left'});
			}
			/*设置默认的导航*/
			if(this.options.show_def_nav){
				this.createNav();
			}
			if(this.options.show_def_control){
				this.$element.append('<div class="'+this.options.control_class+'"><a href="javascript:;" class="prevBtn"></a><a href="javascript:;"  class="nextBtn"></a></div>');
				var $control = this.$element.find('.'+this.options.control_class);
				$control.find('a').css({'position':'absolute','width':'40px','height':'40px','cursor':'pointer','background':'orange','opacity':'0.4'});
				var top = this.height*0.4;
				$control.find('.prevBtn').css({'left':'10px','z-index':'4','top':top+'px'});
				$control.find('.nextBtn').css({'right':'10px','z-index':'4','top':top+'px'});
				
			}
			if(this.options.animate == 'fade'){//如果图片是淡入淡出动画，强制设置第一个图片为显示
				this.item.css({'display':'none'});
				this.item.eq(0).css({'display':'block'});
			}
			/*获取导航元素*/
			if(this.options.show_def_nav){
				 this.$nav = this.$element.find('.nav span');
			}else{
				this.$nav =this.$element.find('.'+this.options.nav_class).children();
			}
			if(typeof this.options.title_class != 'undefined' && this.options.title_animate == 'title_fade'){//如果标题是淡入淡出动画，强制设置第一个标题为显示
				this.title_box =this.$element.find('.'+this.options.title_class);//标题盒
				this.title_box.children().css({'display':'none'});
				this.title_box.children().eq(0).css({'display':'block'});
			}
			this.item.bind({
				mouseover:function(){
					clearInterval(that.$element.timer);
				},
				mouseout:function(){
					if(that.options) that.play();
				}
			});
			
			/*上一张下一张*/
			this.prev_and_next('prev');
			this.prev_and_next('next');

			/*绑定事件*/
			this.bind(this.options.event);
			/*是否自动播放*/
			if(this.options)	this.play();
		},
		createNav:function(){
				this.$element.append('<div class="'+this.options.nav_class+'"></div>');
				var $nav = this.$element.find('.'+this.options.nav_class);
				for(var i =1;i<=this.number;i++){
					$nav.append('<span>●</span>')
				}
				$nav.css({'position':'absolute','z-index':3,'left':'50%','bottom':'20px','text-align':'center','font-size':'0','border-radius':'10px','background-color':' rgba(255,255,255,0.3)','filter': 'alpha(opacity:30)'});
				$nav.find('span').css({'display':'inline-block','font-size':'14px','color':this.options.nav_color,'text-decoration':'none','cursor':'pointer','margin':'2px'});
				$nav.find('span:first').addClass('on');
				$nav.find('.on').css({'color':this.options.nav_hover_color});
				var nav_margin_left = $nav.width()*(-0.5);//获取导航margin-left的偏移量，必需先设置好span的大小之后在获取,否则获取的将是父素的宽度
				$nav.css({'margin-left':nav_margin_left+'px'});
		},
		/*上一张下一张*/
		prev_and_next: function(type){
			var that = this;//slider对象的this储存起来,以便在jquery的函数中使用
			this.$element.find('.'+this.options.control_class+' .'+type+'Btn').click(function(event){
					if(type =='prev'){
						that.index--;
					}else if(type == 'next'){
						that.index++;
					}
					if(that.index <0 && type == 'prev') that.index= that.number-1;
					if(that.index >=that.number && type == 'next') that.index= 0;
					clearInterval(that.element.timer);
					if(that.options.show_def_nav){
						that.$nav.removeClass('on').css({'color':that.options.nav_color});
						that.$nav.eq(that.index).addClass('on').css({'color':that.options.nav_hover_color});
					}else{
						that.$nav.removeClass('on');
						that.$nav.eq(that.index).addClass('on')
					}
					that[that.options.animate]();//图片动画
			});
		},
		bind:function(type){
			var that = this;
			this.$nav.bind(type,function(){
						that.index = that.$nav.index(this);//当前this指向的导航元素对象,例如span对象
						if(that.options.show_def_nav){
							that.$nav.removeClass('on').css({'color':that.options.nav_color});
							that.$nav.eq(that.index).addClass('on').css({'color':that.options.nav_hover_color});
						}else{
							that.$nav.removeClass('on');
							that.$nav.eq(that.index).addClass('on')
						}
						$(that.item_wrap).stop();//停止当前所有动面，如果没有这一句，在快速切换导航时，图片将一直切换,直到所有动画执行完并，造成效果不佳。
						
						that[that.options.animate]();//图片动画
						clearInterval(that.element.timer);
			});
			this.$nav.bind('mouseout',function(){
						if(that.options){
							that.play();
						}
			})
		},
		sliderNext:function(){
			this.index++
			if(this.index >= this.number){
				this.index =0;
			}
			if(this.options.show_def_nav){//是否使用默认导航
				this.$nav.removeClass('on').css({'color':this.options.nav_color});
				this.$nav.eq(this.index).addClass('on').css({'color':this.options.nav_hover_color});
			}else{
				this.$nav.removeClass('on');
				this.$nav.eq(this.index).addClass('on')
			}
			this[this.options.animate]();//图片动画
		},
		play : function(){
				var that = this;//setInterval中的this是指向window对象，所以也要储存起来，以便在setInterval中使用
				if(this.element.timer)clearInterval(this.element.timer);
				this.element.timer = setInterval(function(){
					that.sliderNext();
				},this.options.duration);
		},
		title_fade:function(){
			
			
			this.title_box.children(':visible').stop().fadeOut(this.options.title_fadeOut_time);
			this.title_box.children().eq(this.index).stop().fadeIn(this.options.title_fadeOut_time);
		},
		title_roll:function(){
			var that= this;
			var title_box = that.$element.find('.'+that.options.title_class);//标题盒
			var height = title_box.height();
			if(that.options.direction == 'vertical'){
					$(title_box).animate({
						top: -height*that.index+'px'
					},'slow');
			}else{
					title_box.css({'width':that.vars.width*that.number+'px'});//设置盒宽度
					title_box.children().css({'float':'left','width':that.vars.width+'px','height':height+'px'});
					$(title_box).animate({
						left:  -that.vars.width*that.index+'px' 
					},that.options.speed);
			}
		},
		animate:function(){
			var that= this;
			if(that.options.direction == 'vertical'){
				$(that.item_wrap).animate({
						top: -that.height*that.index+'px'
				},that.options.speed,function(){
					
					if(that.options.title_class && that.options.title_animate){
						that[that.options.title_animate]();
					}
					
				});
			}else{
					$(that.item_wrap).animate({
						left: -that.width*that.index+'px' 
				},that.options.speed,function(){
					if(that.options.title_class && that.options.title_animate){
						that[that.options.title_animate]();
					}
					
				});
			}
		},
		fade:function(){
			
			this.item_wrap.children(':visible').stop().fadeOut(this.options.fadeOut_time);
			this.item.eq(this.index).stop().fadeIn(this.options.fadeIn_time);
		}
	}
	$.fn.zSlider = function(options){
		var obj = new zSlider(this,options);
		return obj.init();
	}
})(jQuery,window,document)
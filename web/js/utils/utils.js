/**
 * 字符串序列化为对象
 * @method str2Args
 * @param {String} 待分割字符串
 * @param {String} 分隔符
 */
var helper = {
    timerInterval: null,    //用于倒计时
	curr_user:{},	//当前登录用户信息
    accUrl: "/chataccess",  //时时请求聊天的地址
    //时时请求聊天的数据
    accData: {
        order: 4
    },
    //时时检测聊天
    accCheck: function() {
        var _this = this;

        var $notify = $('.bottom-msg-icon');

        $.get(_this.accUrl, {access: _this.accData}, function(res){
            if(!res.message){
                $notify.find('.bottom-msg-notify-num').text(res.message);
                $notify.hide();
            }else{
                if(res.message > 99) res.message = 99;
                /*var curNum = navNoticeObj.text();
                curNum = parseInt(curNum);
                if(res.message > curNum){
                    //播放录音
                    $("#msgnoticevoice")[0].play();
                }*/
                $notify.find('.bottom-msg-notify-num').text(res.message);
                $notify.show();
            }
        }, "json");
    },

    /**
     * 时时数据
     */
    longConnectData: function() {
        var _this = this;

        //聊天
        _this.accCheck();

        window.footerNaviAccIntvalHandler = window.setInterval(helper.accCheck, 5000);
    },

    //计算小图的尺寸
    minPicSize:function(minHeigth,minWidth,big_imgheight,big_imgWidth) {
        var maxWidth = 286;
        var maxHeigth = 286 * (big_imgheight / big_imgWidth);

        if (minHeigth / maxHeigth > minWidth / maxWidth) {
            var min_picH = (2 * maxHeigth) / 5;
            var min_picW = (min_picH / minHeigth) * minWidth;
        } else if (minHeigth / maxHeigth < minWidth / maxWidth) {
            var min_picW = (2 * maxWidth) / 5;
            var min_picH = (min_picW / minWidth) * minHeigth;
        } else {
            var min_picW = (2 * maxWidth) / 5;
            var min_picH = (2 * maxHeigth) / 5;
        }
        var returnVal = {};
        returnVal.proWidth = min_picW;
        returnVal.proHeight = min_picH;
        return returnVal;
    },

    //大图展示成小图尺寸
    max_changMinPic:function(minHeigth,minWidth,big_imgheight,big_imgWidth){
        var minPicWidth = 286;
        var minPicHeigth = 286*(minHeigth/minWidth);
        if(big_imgheight / minPicHeigth> big_imgWidth/minPicWidth){
            var bigToMinPicH = (2*minPicHeigth)/5;
            var bigToMinW = (bigToMinPicH/big_imgheight)*big_imgWidth;
        }else if(big_imgheight / minPicHeigth < big_imgWidth/minPicWidth){
            var bigToMinW = (2*minPicWidth)/5;
            var bigToMinPicH = (bigToMinW/big_imgWidth)*big_imgheight;
        }else{
            var bigToMinW = (2*minPicWidth)/5;
            var bigToMinPicH = (2*minPicHeigth)/5;
        }

        var returnVal = {};
        returnVal.pWidth = bigToMinW;
        returnVal.pHeight = bigToMinPicH;

        return returnVal;
    },

    init_user_data:function(){
    	var _this = this;
        var url = window.ENV.host+"/init_user_data.html";
            $.get(url,{},function(datas){
                var userInfo = datas.data.userInfo;
                _this.curr_user = userInfo;
                userInfo.is_subscribe = 0;  //测试专用

                userInfo = userInfo || (new Object());
                var isSubscribe = userInfo.is_subscribe || 0;

                if(isSubscribe == 1){
                    $("#code_gzH").html('进入浮世绘');
                    $('#code_gzH').bind('click',function(){
                        window.location = '/wandan/html/newIndex.html';
                    });
                }else{
                    $("#code_gzH").html('关注公众号');
                    $('#code_gzH').bind('click',function(){
                        $.wdTip.showCode();
                    });
                }

            },'json');
    },

    //进入首页
    jump_index:function (){
        window.location = '/wandan/html/newIndex.html';
    },


    str2Args: function(query, split) {
        var args = {};
        query = query || '';
        split = split || '&';
        var pairs = query.split(split);
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var argname = pairs[i].substring(0, pos).replace(/amp;/, "");
            var value = pairs[i].substring(pos + 1);
            args[argname] = decodeURIComponent(value);
        }
        return args;
    },
    /**
     * 将Object转换为字符串参数
     * @method args2Str
     * @param {Object} args 需要转换的对象
     * @param {String} split 分隔符，默认是&
     * @return String 字符串参数
     */
    args2Str: function(args, split) {
        split = split || '&';
        var key, rtn = '',
            sp = '';
        for (key in args) {
            //value为空的忽略
            if (args[key]) {
                rtn += (sp + key + '=' + encodeURIComponent(args[key]));
                sp = split;
            }
        }
        return rtn;
    },
    jsonObjParams2Str: function(params, link) {
        if (!link) {
            link = "&";
        }
        var argsstr = '';
        for (key in params) {
            //value为空的忽略
            if (params[key]) {
                var tmpstr = key + '=' + params[key];
                tmpstr += '&';
                argsstr += tmpstr;
            }
        }
        return argsstr;
    },

    isWeiXin: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    preventBackgroundScroll:function(){
        $("body,html").css({"overflow":"hidden"});
    },
    resumeBackgroundScroll:function(){
        $("body,html").css({"overflow":"auto"});
    },
    setTitle: function(t) {
        var $body = $('body');
        document.title = t;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/fav.ico" height="0"></iframe>').on('load', function() {
            setTimeout(function() {
                $iframe.off('load').remove()
            }, 0)
        }).appendTo($body);
    },

    //****************************************************************
    //* 名　　称：IsEmpty
    //* 功    能：判断是否为空
    //* 入口参数：fData：要检查的数据
    //* 出口参数：True：空
    //*           False：非空
    //*****************************************************************
    isEmpty: function(v) {
        switch (typeof v) {
            case 'undefined':
                return true;
            case 'string':
                if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
                break;
            case 'boolean':
                if (!v) return true;
                break;
            case 'number':
                if (0 === v || isNaN(v)) return true;
                break;
            case 'object':
                if (null === v || v.length === 0) return true;
                for (var i in v) {
                    return false;
                }
                return true;
        }
        return false;
    },
    isAndroid: function() {
        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
            return true;
        }
        return false;
    },
    isIOS: function() {
        var u = navigator.userAgent;
        if (u.indexOf('iPhone') > -1) { //安卓手机
            return true;
        }
        return false;
    },
    showPage: function(page, params, hashparams) {
        if (this.isEmpty(params)) {
            if (this.isEmpty(hashparams)) {
                window.location.href = page;
            } else {
                window.location.href = page + "#" + this.jsonObjParams2Str(hashparams);
            }
            return;
        }
        if (this.isEmpty(hashparams)) {
            window.location.href = page + "?" + this.jsonObjParams2Str(params);
        } else {
            window.location.href = page + "?" + this.jsonObjParams2Str(params) + "#" + this.jsonObjParams2Str(hashparams);
        }
    },
    changeHash: function(hashparams) {
        var arr = window.location.href.split("#");
        window.location.href = arr[0] + "#" + this.jsonObjParams2Str(hashparams);
    },
    /***
     * 本地化存储数据，
     * @param key   string类型
     * @param obj   存储非函数类型的对象，不深度拷贝
     * @private
     */
    _store: function(key, obj) {
        var value;
        //优先使用localstorege,其次使用cookie,
        if (window.localStorage) {
            if (obj) {
                if (typeof obj == "object") {
                    window.localStorage.setItem(key, JSON.stringify(obj));
                } else if (typeof obj == "string") {
                    window.localStorage.setItem(key, obj);
                } else {
                    alert("_storeByBrowser:你存储的是非对象");
                }
            } else {
                try {
                    value = JSON.parse(window.localStorage.getItem(key));
                } catch (e) {
                    return window.localStorage.getItem(key);
                }
            }
        } else { //使用cookie
            TQ.cookie('test', 'test');
            if (!document.cookie || document.cookie == '') {
                //alert('请设置您的浏览器支持cookie以便正常访问');暂时放空
                if (obj) {
                    value = TQ._store(key, obj);
                } else {
                    value = TQ._store(key);
                }

            } else {
                if (obj) {
                    if (typeof obj == "object") {
                        value = TQ.cookie(key, JSON.stringify(obj));
                    } else if (typeof obj == "string") {
                        value = TQ.cookie(key, obj);
                    } else {
                        alert("_storeByBrowser:你存储的是非对象");
                    }
                } else {
                    try {
                        value = JSON.parse(TQ.cookie(key));
                    } catch (e) {
                        value = TQ.cookie(key);
                    }
                }
            }
        }
        return value;
    },

    /**
     * 获取url参数字段
     */
    getUrlParams: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null)
            return decodeURIComponent(r[2]);
        return null; //返回参数值
    },

    //获取字符串的长度(区分中英文)
    Bytelen: function(str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },


    //计算对象成员个数
    countObjNum: function(o) {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    },

    /**
     * 动态显示时间
     * @param timetamp  时间差
     * @param model  要显示时间的标签的ID属性
     */
    getTimeStr:function(timetamp,model){
        var day = "0";
        var hour = "0";
        var minute = "0";
        var second = "0";

        if(timetamp > 24*3600){
            day = parseInt(timetamp / (24 * 60 * 60 ));
        }
        var dayMillisecond = day * 24 * 60 * 60 ;
        if ((timetamp -dayMillisecond) > 60 * 60 ) {
            hour = parseInt((timetamp - dayMillisecond) / (60 * 60 ));
            hour = hour<10?"0"+hour:hour;
        }
        var hourMillisecond = hour * 60 * 60 ;
        if ((timetamp - dayMillisecond - hourMillisecond) > 60 ) {
            minute = parseInt((timetamp - dayMillisecond - hourMillisecond) / (60 ));
            minute = minute<10?"0"+minute:minute;
        }

        var minuteMillisecond = minute * 60 ;
        if ((timetamp - dayMillisecond - hourMillisecond - minuteMillisecond) > 1) {
            second = parseInt((timetamp - dayMillisecond - hourMillisecond - minuteMillisecond));
            second = second<10?"0"+second:second;
        }

        time = timetamp - 1;
        var timeStr = day+"天"+hour + "时" + minute + "分"+second+"秒";
        $("#"+model).html(timeStr);

        if(time<=0){
            $("#"+model).html("活动已截止");
            window.clearInterval(clock);
        }

    },
    /**
     * 展示公共关注弹层
     */
    showPubGuanZhu:function(){
    	
    },
    /**
     * 绑定公共按钮
     */
    bindPubBtn:function(){
    	
    },

    /**
     * 添加点赞 分享  公共方法
      * @param target_type  对象来源:1求画;2作品;3画手;4学校
     * @param target_id  对应来源的主键id
     * @param opr_type  操作类型  1点赞 2分享
     */
    paintJoin:function(target_type,target_id,opr_type){
        var url = window.ENV.host + '/index.php?app=wap&mod=Paint&act=paintJoin';

        var postData = {
            target_type:target_type,
            target_id:target_id,
            opr_type:opr_type

        };
        //console.log(url);
        $.post(url,postData, function(res){
            if (res.status == -1000) {
                alert('请先登录');
                window.location.href = window.ENV.host +'/login.html';
            } else if (res.status == 1) {
                popup.showTips(res.info);
            } else {
                popup.showTips(res.info);
            }
        }, 'json');
    },

    //获取字符串的长度(区分中英文)
    Bytelen: function(str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    /**
     * 倒计时
     * timestamp:2015-03-12 12:12:12
     */
    timer: function(timestamp, module){
        var _this = this;

        var timeArr = timestamp.split(' ');
        var time1 = timeArr[0].split('-');
        var time2 = timeArr[1].split(':');
        var year = parseInt(time1[0], 10);
        var month = parseInt(time1[1], 10);
        var day = parseInt(time1[2], 10);
        var hour = parseInt(time2[0], 10);
        var minute = parseInt(time2[1], 10);
        var second = parseInt(time2[2], 10);

        var ts = (new Date(year, (month - 1), day, hour, minute, second)) - (new Date());//计算剩余的毫秒数

        if (ts <= 0) {
            window.clearInterval(_this.timerInterval);

            if (($('#reward-tip-exipre').is(':visible'))) {
                $('#reward-tip-exipre').hide();
                $('#none-reward-tip').show();
            }
        } else {
            var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数

            dd = _this.checkTime(dd);
            hh = _this.checkTime(hh);
            mm = _this.checkTime(mm);
            ss = _this.checkTime(ss);

            var timeStr = dd + "天" + hh + "时" + mm + "分" + ss + "秒";
            
            if (module == 'xuanshang') {
                $('#reward-exipre-time').html(timeStr);

                if (!($('#reward-tip-exipre').is(':visible'))) {
                    $('#reward-tip-exipre').show();
                    $('#none-reward-tip').hide();
                }
            }
        }
        
    },
    //检测时间
    checkTime: function(i) {
        if (i < 10) {
            i = "0" + i;
        }

        return i;
    },
    //显示悬赏倒计时
    showTimer: function(timestamp, module) {
        var _this = this;

        //默认触发
        _this.timer(timestamp, module);

        _this.timerInterval = window.setInterval("helper.timer('"+timestamp+"', '" + module + "')",1000);
    }
};

/*! popup 插件 */
var popup = function(options) {

    var _default = {
        content: '你好靓仔啊',               //弹窗内容
        isCover: true,                      //是否加遮罩
        isTRclose: true,                    //是否加x关闭按钮
        mode: 'pay',                        //弹窗模式 pay(类似打赏给妹子风格)|view(类似打赏视图风格)
        popCls: '',                         //弹窗扩展样式名
        coverCls: '',                       //遮罩扩展样式名
        xCls: '',                           //关闭x扩展样式名
        closeCallback: function() {},        //关闭弹窗x的回调
        showCallback: function() {}        //显示弹窗的回调
    };
    var settings = $.extend(_default, options);

    //弹窗对象从这里开始 - 0
    function P() {

        this.init();
    }
    P.fn = P.prototype;

    P.fn.init = function() {

        var html = '<div class="popup ' + settings.popCls + '">\
                    <div class="popup-bd">' + settings.content + '</div>';

        //右上角关闭按钮
        if (settings.isTRclose) {

            //pay模式，关闭按钮在外面
            if(settings.mode == 'pay') {
                this.btnPopClose = $('<div class="popup-close popup-close-pay '+ settings.xCls +'"></div>').appendTo('body');

            } else {
                html += '<div class="popup-close '+ settings.xCls +'"></div>';
            }
        }

        this.popup = $(html).appendTo('body');
        //非pay模式，关闭按钮
        if(settings.isTRclose && settings.mode != 'pay') {
            this.btnPopClose = this.popup.find('.popup-close');
        }

        //是否加遮罩
        if (settings.isCover && settings.mode != 'tips') {
            this.cover = $('<div class="popup-cover ' + settings.coverCls + '"></div>').appendTo('body');
        }

        this.bind();
        this.setPos();

        settings.showCallback && settings.showCallback.call(this);
    };

    //设置弹窗位置
    P.fn.setPos = function() {

        var self = this,
            height = this.popup.height();

        this.popup.addClass('ani').css({
            '-webkit-transform': 'translate3d(0, -' + height / 2 + 'px, 0)',
            'opacity': 1
        });

    };

    P.fn.bind = function() {
        var self = this;

        this.btnPopClose && this.btnPopClose.on('click', function() {
            helper.resumeBackgroundScroll();
            settings.closeCallback && settings.closeCallback();

            self.destory();
        });

        //弹窗其他地方用了j-popup-close想关闭的
        this.popup.on('click', '.j-popup-close', function() {
            helper.resumeBackgroundScroll();
            settings.closeCallback && settings.closeCallback();

            self.destory();

        });


        // 点击蒙版销毁
        // this.cover.on('click', function() {

        //     self.destory();
        // });

    };

    /*
     * 更新弹窗内容
     * @param content: 更新的内容
     */

    P.fn.update = function(content) {

        var bd = this.popup.find('.popup-bd');

        bd.html(content);
        this.setPos();
    };

    //干掉它
    P.fn.destory = function() {

        this.popup.off().remove();
        this.cover && this.cover.remove();
        this.btnPopClose && this.btnPopClose.remove();
    };

    return new P;

};

/*
 *弹窗小提示
 *@param content 显示的文案
 *@param isLoading 是否在文案前面添加loading的icon
*/
popup.tips = function(content, isLoading,showlayoutbln) {

    var html,
        _tips;

    if(content) {
        html = '<div class="pop-tips js-tips-about"><div class="pop-tips-cont">';

        if(isLoading) {
            html += '<div class="pt-loading"></div>';
        }
        html += content+'</div></div>';
        var poplayout ='<div class="popup-cover bg-op06 js-tips-about js-tips-layout hide" style="z-index: 100; opacity: 0.7; display: block; background-color: rgb(0, 0, 0);"></div>';
        _tips = $(html).appendTo('body');
        if(showlayoutbln)
        $(poplayout).appendTo('body');
        //设置位置
        var height = _tips.height(),
            width = _tips.width();

        _tips.css({
            '-webkit-transform': 'translate3d(-' + width / 2 + 'px, -' + height / 2 + 'px, 0)'
        });

        return _tips;

    } else {
        alert('没传内容啊');
    }
};
//清除所有通过popup添加的tips
popup.clearAllTips = function() {

    //$('.pop-tips').remove();
    $(".js-tips-about").remove();

};
popup.showTips=function(content, isLoading,showlayoutbln,timeout){
    popup.tips(content, isLoading,showlayoutbln);
    setTimeout(function(){
        popup.clearAllTips();
    },timeout||2000);
};
//绑定到jQuery对象
$.fn.popup = function(conf) {
	var $target = this;	//当前点击对象

    //conf主动触发传入配置
    if(conf) {

        popup(conf);

    } else {

    //把配置写到dom里面的情况

        /* conf里面一般配置 
         * tpl 弹窗内容放置的dom
         * postfixCls 供弹窗和遮罩扩展样式的类名后缀
         * popCls 是否额外加弹窗样式名
         * coverCls 是否额外加遮罩样式名
         * mode 弹窗模式
        */
        var s = $(this).data('conf');
            sArr = s.split('|');
            conf = {};

        $.each(sArr, function(index, val) {

            var item = val.split(':');

            if(item.length == 2) {

                conf[$.trim(item[0])] = $.trim(item[1]);
            }
             
        });

        if(conf.postfixCls) {

            conf.popCls && (conf.popCls = 'popup-' + conf.postfixCls);
            conf.coverCls && (conf.coverCls = 'cover-' + conf.postfixCls);

        }

        if(conf.x) {

            conf.xCls = 'popup-close-' + conf.x;
        }

        if(conf.tpl) {

            conf.content = $(conf.tpl).html();
            
            //显示回调
            conf.showCallback = function() {
            	if (conf.postfixCls == 'reward-TA') {	//悬赏
            		var price = $('#paint_gratuity').html();	//悬赏金额
                	var qiuhuaId = helper.getUrlParams('paintId');
                	
                	var $pop = $('.popup-reward-TA:visible');
                	$pop.find('.reward-ta-had i').html(price);
                	
                	var data = {
                		'target_id': qiuhuaId,
                		'target_type': 4
                	};
                	
                	//获取已经打赏过的人
                	var url = window.ENV.host + '/index.php?app=wap&mod=Gratuity&act=ajaxGetGratuityList';

        		    $.get(url, data, function(res){
        		    	var listData = res.data.grantity_list;
                        var expireTime = res.data.expire_time;
        		    	
        		    	if (listData.length > 0) {
        		    		$pop.find('.p-list-tip').hide();
        		    		
        		    		for(var i = 0; i < listData.length; i++) {
        		    			var tmpl = $("#popup-payc-user-template").tmpl(listData[i]);
        		    			tmpl.insertAfter('.p-list-tip');
        		    		}
        		    	} else {
        		    		$pop.find('.p-list-tip').show();
        		    	}

                        if (expireTime != '') { //有过期时间
                            helper.showTimer(expireTime, 'xuanshang');
                        } else {    //没有过期时间
                            if (listData.length > 0) {  //说明没有同步及时更新
                                expireTime = res.data.curr_expire_time;

                                helper.showTimer(expireTime, 'xuanshang');
                            } else {
                               $('#reward-tip-exipre').hide();
                               $('#none-reward-tip').show();
                           }
                        }
        		    }, 'json');
        		    
        		    $pop.find('.j-btn-reward').on('click', function() {
        		    	var $btn = $(this);
        		    	var moneyVal = $.trim($pop.find('input.j-p-money').val());
        		    	
        		    	if(moneyVal) {

        		            if(!/^\d{1,}(\.\d{0,2})?$/g.test(moneyVal)) {
        		            	alert('赏钱格式有误，请重新输入');
        		                return false;
        		            }

        		        } else {
        		        	alert('请输入赏钱');
        		            return false;
        		        }
        		    	
        		    	var postData = {
    		    			target_id: qiuhuaId,
    		    			target_type: 4,
    		    			price: moneyVal
    		    		};
        		    	
        		    	//ajax 提交表单
        		        var url = window.ENV.host + '/index.php?app=wap&mod=Gratuity&act=doGratuity';
        		        
        		        $btn.attr('disabled', 'disabled');
        		    	
        		    	popLogic.comTips('正在唤起微信支付', true);

        			    $.post(url, postData, function(res){
        			    	$btn.removeAttr('disabled');
        			    	$('.pop-tips:visible').remove();
        			    	
        			        if (res.status == -1000) {
        			            alert('请先登录');
        			            window.location.href = '/login.html';
        			        } else if (res.status == 1) {
        			        	//调用微信支付
        			            $('body').append(res.data.charge_html);
        			            wap_pay({successCallback: function(callData){
        			            	$pop.remove();	//移除掉
        			            	$('.popup-cover:visible').remove();
        			            	
        			            	popLogic.comTips('悬赏成功');
        			            	
        			            	//更新显示的价格
        			            	price = new Number(price);

                                    if (price <= 0) {   //原先没有价格
                                        if ($('#paint-top-banner').length > 0) {
                                            $('#paint-top-banner img').attr('src', '/wandan/img/huadetailbanner.png');
                                        }
                                    }

        			            	moneyVal = new Number(moneyVal);
        			            	price = Number((price + moneyVal).toFixed(2));
        			            	
        			            	if ($('#paint_gratuity').length > 0) {
        			            		$('#paint_gratuity').html(price);

                                        //回调初始化分享
                                        $.PaintDetai.initDefaultShare && $.PaintDetai.initDefaultShare();
        			            	}

                                    if ($('#no_paint_tip .no_paint_tip_xushang').length > 0) {
                                        $('#no_paint_tip .no_paint_tip_xushang').hide();
                                    }
        			            }});
        			        } else {
        			            alert(res.info);
        			            return false;
        			        }
        			    }, 'json');
        	        });
            	}
            };
            
            if (conf.postfixCls == 'wechat-at') {	//如果是关注
            	userFollow(this, conf);
            } else if (conf.postfixCls == 'paint-collect'){	//如果是收藏求画
            	paintCollect(this, conf);
            } else {
            	 popup(conf);
            }
        } else {
            alert('没找到需要弹窗的内容，请查看utils.js -> $.fn.popup');
        }
    }

}

//是否提交
var isSubmit = false;

//用户关注
function userFollow(target, conf) {
	var $this = $(target);

	if (isSubmit == true) {
		return false;
	}

	var fid = $this.attr('rel-fid');
	var flag = $this.attr('rel-status');
	
	var isSubscribe = helper.curr_user.is_subscribe;
	
	var postData = {
		fid:fid,
		flag:flag
	};
	
	if (flag == 1) {	//取消关注

        $.wdTip.showCancelFollow();

        $("#cancelFollow").click(function(){
            isSubmit = true;
            doFollow(postData, $this,flag,isSubscribe, conf);
        });

		//if (confirm('真的要取消关注吗？')) {
		//	isSubmit = true;
		//	doFollow(postData, $this, flag, isSubscribe, conf);
		//}

	} else {	//关注
		isSubmit = true;
		doFollow(postData, $this, flag, isSubscribe, conf);
	}
}

function doFollow(postData, $target, flag, isSubscribe, conf) {
	var url = window.ENV.host + '/index.php?app=wap&mod=Follow&act=doFollow';
	$.post(url, postData, function(res){
		isSubmit = false;

		if (res.status == -1000) {
			alert('请先登录');
			window.location.href = '/login.html';
		} else if (res.status == 1) {
			if (flag == 1) {	//原先是已关注状态,现在要变成未关注
				$target.attr('rel-status', 0);
				$target.html('+关注');
                $("#viewPortSetting").attr("content","width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
                $("body").children().css({"zoom":0.5});
                $("li").css("zoom",0.5);
                if (isSubscribe == 1) {	//已经关注过公众号
                    popLogic.comTips('取消成功');
                } else {
                    popup(conf);
                }
			} else {
				$target.attr('rel-status', 1);
				$target.html('已关注');

                if (isSubscribe == 1) {	//已经关注过公众号
                    popLogic.comTips('关注成功');
                } else {
                    popup(conf);
                }
			}
		} else {
			alert(res.info);
		}
	}, 'json');
}

//求画收藏
function paintCollect(target, conf) {
	var $this = $(target);

	if (isSubmit == true) {
		return false;
	}

	var targetId = $this.attr('rel-target-id');
	var flag = $this.attr('rel-status');
	
	var isSubscribe = helper.curr_user.is_subscribe;
	
	isSubmit = true;
	
	var url = window.ENV.host + '/index.php?app=wap&mod=Collect&act=doCollectQiuhua';
	$.post(url, {target_id:targetId, flag:flag}, function(res){
		isSubmit = false;

		if (res.status == -1000) {
			alert('请先登录');
			window.location.href = '/login.html';
		} else if (res.status == 1) {
			if (isSubscribe == 1) {	//已经关注过公众号
				if (flag == 1) {
					popLogic.comTips('取消成功');
				} else {
					popLogic.comTips('收藏成功');
				}
			} else {
				//没有关注过公众号
				if (flag == 1) {
					popLogic.comTips('取消成功');
				} else {
					popup(conf);
				}
			}

			if (flag == 1) {	//原先是已关注状态,现在要变成未关注
				$this.attr('rel-status', 0);
				$this.closest('.bottom-btn2').removeClass('focus');
			} else {
				$this.attr('rel-status', 1);
				$this.closest('.bottom-btn2').addClass('focus');
			}
		} else {
			alert(res.info);
		}
	}, 'json');
}

//点击触发弹窗
$('body').on('click', '.j-popup-handle', function() {
    helper.preventBackgroundScroll();
    $(this).popup();

});

//判断是否是微信
function is_weixin() {
    if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    }

    return false;
}

//初始化分享弹窗
function publicInitSharePos(selector,func){
	//看是否已经存在分享弹框
	var popObj = $(".popup-cover.js-share");
	if(!popObj.length){//如果没有弹窗，则增加
		var html_str = '\
		<div class="popup-cover bg-op06 js-share hide" style="z-index: 110;opacity: 0.7;background-color: #000000;">\
		       <div><img src="../img/pop/sharearrow.png" alt=""/></div>\
		        <div class="fs24 white m-auto tac">马上分享给小伙伴们吧，<br> 让我们一起来嗨～</div>\
		</div>\
		';
		$("body").append(html_str);
	}
	$(selector).click(function(){
        $(".js-share").show();
        func(this);
    });
    $(".js-share").click(function(){
        $(".js-share").hide();
    });
}

//微信分享初始化
function doShare(wxParams, shareData) {

    if (!is_weixin()) { return false;}

    var module = shareData.module || '';
    var subModule = shareData.sub_module || '';	//module下的子类
    var targetId = shareData.target_id || 0;
    var targetType = shareData.target_type || 'weixin';
    var channelId = shareData.channel_id || '0000';

    //var uidStr = $.trim($('#share_uid_str').val()) || '';	//分享的所有用户字符串

    var linkUrl = wxParams.link;	//点击分享跳转的链接
    var urlStr = shareData.url_str;	//被分享的页面

    /*if (linkUrl.match(/[\?]/g)) {	//如果参数中有问哈
     linkUrl += '&share_uid_str=' + uidStr;
     } else {
     linkUrl += '?share_uid_str=' + uidStr;
     }

     if (urlStr.match(/[\?]/g)) {	//如果参数中有问哈
     urlStr += '&share_uid_str=' + uidStr;
     } else {
     urlStr += '?share_uid_str=' + uidStr;
     }*/

    shareData = $.extend({}, shareData, {target_id:targetId, target_type:targetType, module: module, sub_module: subModule, channel_id:channelId, _t:new Date().getTime(),url_str:urlStr});
    //shareSuccessCallback(shareData);
    wx.ready(function doWeixinShare() {
        var wxData = {
            imgUrl  : wxParams.imgUrl,
            link    : linkUrl,
            title   : wxParams.title,
            desc    : wxParams.desc,
            success: function(){
                shareSuccessCallback(shareData);
            }
        };
        wx.onMenuShareTimeline(wxData);
        wx.onMenuShareAppMessage(wxData);
        wx.onMenuShareQQ(wxData);
        wx.onMenuShareWeibo(wxData);
    });
}

//分享成功后的回调
function shareSuccessCallback(shareData) {
    //往后台写分享数据
    $.get("/weixinshare.html", shareData, function(res){

        if(shareData.module=='paintRank' || shareData.module=='schoolRankDetail'){  //画手榜  或者   学校详情画手榜
            if(shareData.target_id>0){
                helper.paintJoin(3,shareData.target_id,2);  //分享之后添加分享记录
                $(".js-share").hide();

                var is_share = $("#total-hotval-"+shareData.target_id).attr('data-share');
                if(is_share==0){
                    $(".js-numberadd").html("+2").css("display","block").fadeOut();
                    var old_value = $("#total-hotval-"+shareData.target_id).text(); //旧热力值
                    var new_value = parseInt(old_value)+2;
                    $("#total-hotval-"+shareData.target_id).attr('data-share',1);
                    $("#total-hotval-"+shareData.target_id).text(new_value);
                    $(".pop-hotval").text(new_value);
                }

            }
        }else if(shareData.module=='produceRank'){  //作品榜
            if(shareData.target_id>0){
                helper.paintJoin(2,shareData.target_id,2);  //分享之后添加分享记录
                $(".js-share").hide();

                var is_share = $("#total-hotval-"+shareData.target_id).attr('data-share');
                if(is_share==0) {
                    $(".js-numberadd").html("+2").css("display","block").fadeOut();
                    var old_value = $("#total-hotval-" + shareData.target_id).text(); //旧热力值
                    var new_value = parseInt(old_value) + 2;
                    $("#total-hotval-" + shareData.target_id).attr('data-share', 1);
                    $("#total-hotval-" + shareData.target_id).text(new_value);
                    $(".pop-hotval").text(new_value);
                }

            }
        }else if(shareData.module=='schoolRank'){  //学校榜
            if(shareData.target_id>0){
                helper.paintJoin(4,shareData.target_id,2);  //分享之后添加分享记录
                $(".js-share").hide();
                //$(".js-numberadd").html("+2").css("display","block").fadeOut();

            }
        }else if(shareData.module=='paintDetail' || shareData.module=='paintDetailDefault'){  //求画详情
            if(shareData.target_id>0){
            	if (shareData.sub_module == "zuopin") {	//求画详情作品
                    //更新作品列表中作品对应的分享数
                    $shareNum = $('#paint-item-' + shareData.target_id + ' .paint-item-share-num');
                    $hotval = $('#paint-item-' + shareData.target_id + ' .paint_item_hotval');
                    
                    if ($shareNum.length > 0) {
                        var shareNum = $shareNum.text();
                        shareNum = shareNum ? parseInt(shareNum, 10): 0;
                        $shareNum.text(shareNum + 1);
                    }

                    //todo 分享作品 是否要贡献热力值  (此处还没有添加登录用户是否已经分享过的判断)
                    if ($hotval.length > 0) {
                        //当天是否已经分享过一次
                        var hasShare = $hotval.attr('rel-is-share');
                        hasShare = parseInt(hasShare, 10);

                        if (hasShare == 0) {    //说明今天没有分享过
                            //热力值+2
                            //$(".js-numberadd").html("+2").css("display","block").fadeOut();

                            $hotval.attr('rel-is-share', '1');

                            var value = $hotval.text();
                            value = value ? Number(value): 0;
                            value = value + 2;
                            $hotval.text(value);
                        }
                    }
                    
                    helper.paintJoin(2,shareData.target_id,2);  //分享之后添加分享记录

                    $(".js-share").hide();
            	} else if (shareData.sub_module == "qiuhua") {
                    if (shareData.isSubscribe == '0') { //没有关注公众号
                        var popOptions = {};
                        popOptions.tpl = '#qiuhua-share-template';
                        popOptions.popCls = 1;
                        popOptions.postfixCls = 'qiuhua-share';
                        popOptions.mode = 'view';
                        popOptions.x = 1;
                        popOptions.content = $('#qiuhua-share-template').html();
                        popOptions.isTRclose = 1;
                        popOptions.xCls = 'popup-close-1';

                        popup(popOptions);
                    }

            		helper.paintJoin(1,shareData.target_id,2);  //分享之后添加分享记录
                    //$(".js-numberadd").html("+2").css("display","block").fadeOut();

                    $(".js-share").hide();
            	}
            }
        }else if(shareData.module=='homespace'){  //个人主页
            if(shareData.target_id>0){
                if (shareData.sub_module == "homespace") { //个人主页
                    var paintId = shareData.paintId || 0;

                    if (paintId > 0) {
                        helper.paintJoin(2,paintId,2);  //分享之后添加分享记录

                        //更新作品列表中作品对应的分享数
                        $shareNum = $('.user-space-share[rel-target-id='+paintId+']');
                        
                        if ($shareNum.length > 0) {
                            var shareNum = $shareNum.text();
                            shareNum = shareNum ? parseInt(shareNum, 10): 0;
                            $shareNum.text(shareNum + 1);
                        }

                        //列表当中
                        $shareNum = $('#paint-item-' + paintId + ' .share_icon_px_num');
                        
                        if ($shareNum.length > 0) {
                            var shareNum = $shareNum.text();
                            shareNum = shareNum ? parseInt(shareNum, 10): 0;
                            $shareNum.text(shareNum + 1);
                        }
                    }

                    $(".js-share").hide();
                }
            }
        }

    }, 'json');
}

//瀑布流滚动加载
function _reachBottom() {
    var clientHeight = 0;
    var scrollHeight = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    if (scrollTop + clientHeight + 100 > scrollHeight && clientHeight != scrollHeight) {
        return true;
    } else {
        return false;
    }
}
function getRandomArrItem(arr){
    if(helper.isEmpty(arr)){
        return "";
    }
    return arr[Math.round(Math.random()*arr.length)];
}



/************分享蛋痛begin*************/
/***
 *静态的数据可以直接填充到数组内，动态的需要特殊法的 直接在参数里传
 * @param shareURL
 * @param imgUrl
 * @param title
 * @param from   8:浮世绘作品玩单详情页  9:浮世绘（最新） 10:浮世绘（热门）11:浮世绘（学校） 16:作品上传页(未搞)
 */
function setWxShareConfig(title,desc,shareURL,imgUrl,from){
    var titleArrObj = {
        "f8":["默认：（用户昵称）会玩·浮世绘头像（用户可修改，修改后拉取他的详情标题）"],//需要自传title URL
        "f9":["浮世绘| 春风十里，不如画你"],
        "f10":["浮世绘| 春风十里，不如画你"],
        "f11":["哪个学校最会玩","灵魂画手都在这些学校","这学校简直666"],
        "f16":["画画至死，恶搞至上",
                "曾经有一张真挚的照片等你来画…",
                "画画有打赏，恶搞也赚钱",
                "如果你会画画那就来",
                "想象力才是第一生产力",
                "听说你很会画画",
                "阅妞无数，不如画画很酷",
                "春风十里，不如画你"]

    };
    var descArrObj = {
        "f8":["我画画，就是为了安慰你无处安放的沮丧","我的画是你的心灵A片","画出你面具下的思想","春风十里，不如画你","我的创意收集起来可以发电" ],
        "f9":["画画至死，恶搞至上","美女帅哥都等着你帮TA画画呢","会画画撩妹技能max","画画有打赏，恶搞也赚钱",
            "做人没有梦想，那和咸鱼有什么区别","如果你会画画那就来","召集最会画画的人","玩单浮世绘，千军万马来相会","做一个好基友，当一个好画手",
            "想象力才是第一生产力","听说你很会画画","阅妞无数，不如画画很酷","只要有画笔，哪里都是马尔代夫"],
        "f10":["浮世绘| 春风十里，不如画你"],
        "f11":[
            "画画至死，恶搞至上",    "美女帅哥都等着你帮TA画画呢",    "会画画撩妹技能max",    "画画有打赏，恶搞也赚钱", "做人没有梦想，那和咸鱼有什么区别", "如果你会画画那就来", "召集最会画画的人", "玩单浮世绘，千军万马来相会", "做一个好基友，当一个好画手", "想象力才是第一生产力",
            "听说你很会画画",
            "阅妞无数，不如画画很酷",
            "只要有画笔，哪里都是马尔代夫"
        ],
        "f16":[//需传desc
            "（拉取用户求画时填的说明）"
        ]
    };

    //组装数据
    var wxParams = {};
    wxParams.link = shareURL||window.location.href;
    wxParams.imgUrl = imgUrl||"http://wdts.318318.cn/wandan/img/logo.png";
    wxParams.title = title||getRandomArrItem(titleArrObj[from]);
    wxParams.desc = desc||getRandomArrItem(descArrObj[from]);

    var shareData = {};
    //shareData.module = "paintDetail";
    doShare(wxParams, shareData);
}

/************分享蛋痛end*************/
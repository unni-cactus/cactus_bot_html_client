(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, accessTokenInput, client_code;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    accessTokenInput = document.getElementById("access_token");
    var setAccessTokenButton = '269997d82d3b4347a72e99dbaa142af0';

    queryInput.addEventListener("keydown", queryInputKeyDown);
    setAccessToken();

    //invoke welcome event
    window.addEventListener('message', sendWelcomeMessage);
    //end of welcome event invoke

    track_hits();
    if( localStorage.message ) {
      var message = jQuery.parseJSON(localStorage.message)
      localStorage.message = '';
      console.log(message);
      $.each(message, function( order, msg ) {
        if(msg.side == 'right'){
          var responseNode = createResponseNode();
          setResponseOnNode(msg.msg, responseNode);
        } else {
          createQueryNode(msg.msg)          
        }
      });
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }
  }

  function setAccessToken() {
    document.getElementById("placeholder").style.display = "none";
    document.getElementById("main-wrapper").style.display = "block";
    window.init(accessTokenInput.value);
  }

  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }

    var value = queryInput.value;
    queryInput.value = "";
    createQueryNode(value);

    sendText(value)
      .then(function(response) {
        console.log(response);
        var result; var payload;
        try {
          result = response.result.fulfillment.speech;
          payload = response.result.fulfillment.messages.find(message => message.type === 4);
        } catch(error) {
          result = "";
        }
        if(result){
          var responseNode = createResponseNode();
          setResponseOnNode(result, responseNode);
        }
        if(payload){
          setPayload(payload.payload);
        }

      })
      .catch(function(err) {
        console.log("Something goes wrong on responseNode");
      });
  }

  function createQueryNode(query) {
    var node = document.createElement('div');
    node.className = "clearfix left-align left card-panel green accent-1";
    node.innerHTML = query;
    resultDiv.appendChild(node);
    var history = new Object();
    history.msg = query;
    history.side = 'left';
    if( localStorage.message ) {
      var message = jQuery.parseJSON(localStorage.message)
      message.push(history);
      localStorage.message = JSON.stringify(message);
    } else {
      var messages = new Array;
      messages.push(history)
      localStorage.message = JSON.stringify(messages);
    }
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  function createResponseNode() {
    var node = document.createElement('div');
    node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
    var history = new Object();
    history.msg = response;
    history.side = 'right';
    console.log(history);
    if( localStorage.message ) {
      var message = jQuery.parseJSON(localStorage.message)
      message.push(history);
      localStorage.message = JSON.stringify(message);
    } else {
      var messages =  new Array;
      messages.push(history)
      localStorage.message = JSON.stringify(messages);
    }
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  function setCarouselResponseOnNode(carousel){
    console.log('carousel');
    $('#result').append(carouselCardTemplate(carousel.items));
    $('.carousel').carousel();
    preventAClick();
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    node.innerHTML = JSON.stringify(response, null, 2);
  }

  function sendRequest() {

  }

  function sendEventRequest(eventName, eventData){
    if(eventName!='undefined'){
      console.log('event trigger');
      console.log(eventName,eventData);
      sendEvent(eventName, eventData).then(function(response){
        console.log(response);
        var result;
        var result; var payload;
        try {
          result = response.result.fulfillment.speech;
          payload = response.result.fulfillment.messages.find(message => message.type === 4);
        } catch(error) {
          result = "";
        }
        if(result){
          var responseNode = createResponseNode();
          setResponseOnNode(result, responseNode);
        }
        if(payload){
          setPayload(payload.payload);
        }
      });
    }
  }

  function carouselCardTemplate(cards){
    var template = '<div class="carousel">';
    //$.each(cards, function( order, card ) {
      /*
        console.log(card.description);
        console.log(card.image.accessibilityText);
        console.log(card.image.url);
        console.log(card.optionInfo.key);
        console.log(card.optionInfo.synonyms);//array
        console.log(card.title);
      */

      template = template + '<div class="carousel-item">'
                            +'<img src="https://aliexpressagent.com/wp-content/uploads/2014/03/Payment-Information-768x679.jpg">'
                            +'<ul style="padding-left: 10px;">'
                                +'<a value="Make Payment" event="MAKE_PAYMENT">'
                                    +'<li>Make Payment</li>'
                                +'</a>'
                                +'<a href="#check-payment">'
                                    +'<li>Check Payment Status</li>'
                                +'</a>'
                                +'<a href="#editage-card">'
                                    +'<li>Editage Card</li>'
                                +'</a>'
                            +'</ul>'
                        +'</div>';
    //});
    var next = '<div class="carousel-item">'
                            +'<img src="https://thumbs.dreamstime.com/b/receipt-icon-paper-invoice-total-bill-dollar-symbol-vector-illustration-flat-style-87311557.jpg">'
                            +'<ul style="padding-left: 10px;">'
                                +'<a event="download-invoice">'
                                    +'<li>Download Invoice/Recipt</li>'
                                +'</a>'
                                +'<a event="edit-invoice">'
                                    +'<li>Edit Invoice/Recipt</li>'
                                +'</a>'
                                +'<a event="request-proforma-invoice">'
                                    +'<li>Request for Proforma Invoice</li>'
                                +'</a>'
                                +'<a event="unable-download-edit-invoice">'
                                    +'<li>Unable to Download/Edit Invoice</li>'
                                +'</a>'
                            +'</ul>'
                        +'</div>';
      template = template+next+'</div>';
      return template;
  }
  
  function preventAClick(){
    $('#chatBox a').click(function(){
      var eventName = $(this).attr('event');
      var value = eventName;
      var data;
      if($(this).attr('value')){
        data = {'data': $(this).attr('value')};
        value = $(this).attr('value');
      }
      if(value){
        createQueryNode(value);
      }
      if(eventName){
        if(eventName == 'JOB_CODE_AFTER_BANK_PAYMENT'){
          localStorage.job_code = value;
        }
        sendEventRequest(eventName,data);
      }      
    });
  } 

  function track_hits(){
   if( localStorage.hits ) {
      localStorage.hits = Number(localStorage.hits) +1;
   } else {
      localStorage.hits = 1;
   }
   console.log("Total Hits :" + localStorage.hits );
  }

  function setPayload(payload){
    showQuickReply(payload.custom_quick_reply);
    if(payload.type=='custom_carousel_card'){
      setCarouselResponseOnNode(payload);
    }
    if(payload.type=='custom_list'){
      showCustomList(payload);
    }
    if(payload.type=='custom_file_upload'){
      showBrowseButton(payload.call_back);  
    }
    if(payload.type=='custom_date_picker'){
      var uploadID  =1;
      var datepicker = '<form><div class = "row"><input type="text" class="datepicker"></div>';
      //datepicker = datepicker+'<button id="'+uploadID+'" style="float: right;" class = "btn waves-effect waves-light red right-align">'
                      +'Sent selected date'
                      +'</button>';
      datepicker = datepicker+'</form>';
      $('#result').append(datepicker);
      $('.datepicker').pickadate({
        onClose: function( arg ){
            if($('.datepicker').val()){
              var data = {'data': $('.datepicker').val()};
              localStorage.date = $('.datepicker').val();
              sendEventRequest(payload.call_back,data);
            }
          }
        });
    }
  }

  function showBrowseButton(callBackEvent){
    var random = Math.floor(Math.random()*1000)+'_set_'+Math.floor(Math.random()*1000);
    random = callBackEvent;
    var formID = 'form_'+random;
    var fileID = 'file_'+random;
    var uploadID = 'upload_'+random;
    $("#"+formID).remove();
    var browse = '<form id="'+formID+'" onsubmit="'+"return showProgressBar('"+random+"')"+'" class = "col s12">'
                    +'<div class = "row">'
                        +'<div class = "file-field input-field">'
                          +'<div class = "btn">'
                             +'<span>Browse</span>'
                             +'<input type = "file" />'
                          +'</div>'
                          +'<div class = "file-path-wrapper">'
                             +'<input id="'+fileID+'" onchange="showUploadButton('+"'"+random+"'"+')" class = "file-path validate" type = "text"'
                                +'placeholder = "Upload file" />'
                          +'</div>'
                        +'</div>'
                      +'<button id="'+uploadID+'" style="display:none; float: right;" class = "btn waves-effect waves-light red right-align">'
                      +'Upload'
                      +'<i class = "material-icons right">arrow_upward</i></button>'
                    +'</div>'
                    +'</form>';
    $('#result').append(browse);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  function showCustomList(lists_data){
    var lists = '<ul class="collection with-header" style="height:auto; position: relative;float: right;top: 0px;">'
                  +'<li class="collection-header">'+lists_data.items[0].title+'</li>';
    $.each(lists_data.items[0].optionInfo,function(index,list){
      list.value  = list.value.replace("HCTR", client_code);
      list.key    = list.key.replace("HCTR", client_code);
      list.title  = list.title.replace("HCTR", client_code);
      lists = lists+'<a value="'+list.value+'" event="'+list.key+'" class="collection-item">'+list.title+'</a>';
    });

    lists = lists+'</ul>';
    $('#result').append(lists);
    preventAClick();
    var height = $(document).height();
    height = height+100;
    $("html, body").animate({ scrollTop: height }, 1000);
  }

  function showQuickReply($replys){
    var quick_reply = '';
    $.each($replys, function( index, reply ) {
      quick_reply = quick_reply+'<a event="'+reply.key+'" value="'+reply.value+'">'
                        +'<div class="chip">'+reply.title+'</div>'
                       +'</a>';
    });
    $('#quick_reply').html(quick_reply);
  }

  function sendWelcomeMessage(e) {
      var emitedData = jQuery.parseJSON(e.data);
      getDataFromEOS(emitedData.accessToken);
  }

  function getDataFromEOS(accessToken){
      $.ajax({
         url: "https://test42.api.cactusglobal.com/v1/client",
         type: "GET",
         beforeSend: function(xhr){
                      xhr.setRequestHeader('Authorization', 'Bearer '+accessToken);
                    },
         success: function(response) { 
              var client_details = jQuery.parseJSON(response);
              var name = client_details.data.email_name+' ('+client_details.data.client_code+')';
              var eventName = 'WELCOME';
              var eventData = {'name': name};
              client_code = client_details.data.client_code
              sendEventRequest(eventName, eventData);
              sendEventRequest('MAIN_MENU'); 
            }
      });
  }
  
  

})();


  function showProgressBar(formID){
    var progress = '<div class = "row" id="progress_'+formID+'">'
                      +'<div class = "progress">'
                        +'<div class = "indeterminate"></div>'
                      +'</div>'
                    +'</div>';
    $('#form_'+formID).append(progress);
    $('#upload_'+formID).attr('disabled','disabled');
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    var eventName = formID;
    var fileName  = $('#file_'+formID).val();
    var eventData = {'data': fileName};
    localStorage.file_name = fileName;

    console.log(localStorage.file_name);
    console.log(localStorage.date);
    console.log(localStorage.job_code);
    //send email from here
    var email = {'date': localStorage.date, 'job_code':localStorage.job_code, 'file_name':localStorage.file_name};
    sendEventRequestPublic('SEND_EMAIL', email, 'send_email');
    sendEventRequestPublic(eventName, eventData, formID);
    return false;
  }

  function showUploadButton(formID){
    $('#upload_'+formID).show();
  }

  function hideProgressBar(formID,msg){
    $('#progress_'+formID).fadeOut('slow');
    $('#form_'+formID).append(msg);
  }

  function sendEventRequestPublic(eventName, eventData="", formID=""){
      sendEvent(eventName, eventData).then(function(response){
        console.log(response);
        var result;
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
        hideProgressBar(formID,result);
      });
  }

  function sendEmailViaCRM(accessToken){
    var email_data = {
      action : 'email_from'
    }; 
      $.ajax({
         url: "http://local.crm.cactusglobal.com/api/for-chat-bot/job-codes",
         type: "POST",
         data: {queryResult:email_data},
         beforeSend: function(xhr){
                      xhr.setRequestHeader('Authorization', 'Bearer '+accessToken);
                    },
         success: function(response) { 
              var client_details = jQuery.parseJSON(response);
              var name = client_details.data.email_name+' ('+client_details.data.client_code+')';
              var eventName = 'WELCOME';
              var eventData = {'name': name};
              client_code = client_details.data.client_code
              sendEventRequest(eventName, eventData);
              sendEventRequest('MAIN_MENU'); 
            }
      });
  }
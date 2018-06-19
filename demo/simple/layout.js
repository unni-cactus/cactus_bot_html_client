/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, accessTokenInput;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    accessTokenInput = document.getElementById("access_token");
    var setAccessTokenButton = '269997d82d3b4347a72e99dbaa142af0';

    queryInput.addEventListener("keydown", queryInputKeyDown);
    setAccessToken();
    //setAccessTokenButton.addEventListener("click", setAccessToken);

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
    var responseNode = createResponseNode();

    sendText(value)
      .then(function(response) {
        console.log(response);
        var result; var carousel;var payload;
        try {
          result = response.result.fulfillment.speech;
          carousel = response.result.fulfillment.messages.find(message => message.type === 'carousel_card');
          payload = response.result.fulfillment.messages.find(message => message.type === 4);
        } catch(error) {
          result = "";
        }
        //setResponseJSON(response);
        if(result){
          setResponseOnNode(result, responseNode);
        }
        if(carousel){
         setCarouselResponseOnNode(carousel, responseNode); 
        }
        if(payload){
          setPayload(payload.payload);
        }

      })
      .catch(function(err) {
        //setResponseJSON(err);

        setResponseOnNode("Something goes wrong", responseNode);
      });

      //invoke even with all request
      /*      
        var eventName = 'main_menu';
        var eventData = {'name': 'Cactus Global - Unni'};
        sendEventRequest(eventName, eventData);
      */
      //end of event infocation
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
      var messages =  new Array();
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
      var messages =  new Array();
      messages.push(history)
      localStorage.message = JSON.stringify(messages);
   }
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
  }

  function setCarouselResponseOnNode(carousel, responseNode){
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
      sendEvent(eventName, eventData).then(function(response){
        console.log(response);
        var result;
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
        var responseNode = createResponseNode();
        setResponseOnNode(result, responseNode);
      });
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
                                +'<a href="#make-payment">'
                                    +'<li>Make Payment</li>'
                                +'</a>'
                                +'<a href="#check-payment">'
                                    +'<li>Check Payment Status</li>'
                                +'</a>'
                                +'<a href="#editage-card">'
                                    +'<li>Editage Cacrd</li>'
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
    $('a').click(function(){
      var eventName = $(this).attr('event');
      alert(eventName);
      sendEventRequest(eventName)
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
    if(payload.file_upload){
      showBrowseButton();  
    } else if(payload.type=='date-picker'){
      console.log('Show date picker');
      var datepicker = '<form><div class = "row"><input type="text" class="datepicker"></div></form>';
      $('#result').append(datepicker);
      $('.datepicker').pickadate();
    }
  }

  function showBrowseButton(random=''){
    random = Math.floor(Math.random()*1000)+'_set_'+Math.floor(Math.random()*1000);
    var formID = 'form_'+random;
    var fileID = 'file_'+random;
    var uploadID = 'upload_'+random;
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

  function sendWelcomeMessage(e) {
    console.log(e);
      var emitedData = jQuery.parseJSON(e.data);
      var eventName = 'WELCOME';
      var eventData = {'name': emitedData.userName};
      sendEventRequest(eventName, eventData);
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
    var eventName = 'UPLOAD';
    var fileName  = $('#file_'+formID).val();
    var eventData = {'file': fileName};
    sendEventRequest(eventName, eventData, formID);
    return false;
  }

  function showUploadButton(formID){
    $('#upload_'+formID).show();
  }

  function hideProgressBar(formID,msg){
    $('#progress_'+formID).fadeOut('slow');
    $('#form_'+formID).append(msg);
  }

  function sendEventRequest(eventName, eventData, formID){
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
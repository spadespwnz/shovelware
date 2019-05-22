var fixedLinkBar = false;
var linkBarOffset = $('#links_bar').offset().top;
var linkBarHeight = $('#links_bar').height();

$( document ).ready(function() {
  adjustLinksBar();
  $("#aboutLink").click(function(){
    console.log($("#about_content").offset().top)
    console.log($(window).height())
    console.log(screen.height);
    var loc = $("#about_content").offset().top-screen.height/2+$("#about").height()/2;
    $('body').animate({ 'scrollTop':loc }, 500);
  })
  $("#projectsLink").click(function(){
    var loc = $("#projects_content").offset().top-screen.height/2+$("#projects_content").height()/2;
    $('html,body').animate({ 'scrollTop':loc }, 500);
  })
  $("#futureLink").click(function(){
    var loc = $("#future_content").offset().top-screen.height/2+$("#future_content").height()/2;
    $('html,body').animate({ 'scrollTop':loc }, 500);
  })
  $("#contactLink").click(function(){
    var loc = $("#contact_content").offset().top-screen.height/2+$("#contact_content").height()/2;
    $('html,body').animate({ 'scrollTop':loc }, 500);
  })

  $(".project").click(function(){
    $(this).find(".project_content").animate({
            height: 'toggle'
        });
  })
});

$(window).scroll(function() {
  adjustLinksBar();

});

function adjustLinksBar(){
  var scroll = $(window).scrollTop();
  var os = linkBarOffset
  var ht = linkBarHeight
  if(scroll > os + (ht/2)){
    if (fixedLinkBar == false){
      $('#links_bar').removeClass('fluid');
      $('#links_bar').addClass('fixed');
      fixedLinkBar = true;
    }
  } else{
    if (fixedLinkBar == true){
      $('#links_bar').addClass('fluid');
      $('#links_bar').removeClass('fixed');
      fixedLinkBar = false;
    }
  }
}

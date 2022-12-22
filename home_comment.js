{

   let heyNoty= function(type,message){
    new Noty({
        theme:'relax',
        text:message,
        type:type,
        layout:'topRight',
        timeOut:1500

    }).show();
   }

   let createComment= function()
   {
       let commentForm= $('#comment-form');
       commentForm.submit(function(e){
           e.preventDefault();

           $.ajax({
               type:'post',
               url:'/comments/create',
               data:commentForm.serialize(),
               success: function(data){
                   console.log(data);
                   let newComment=showComment(data.data.comment);
                   $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                   heyNoty('success','Comment created');
                   deleteComment($('.delete-comment-button',newComment));
               },error(err){
                   console.log(err.responseText);
                   heyNoty('error',err.responseText);
               }
           });
       });
   }

   let showComment=function(comment)
   {
       return $(`<li id="comment-${comment._id}">
       <p>
               <small>
                     <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
               </small>
      
         <p>${comment.content}</p>
       
         <small>
         <p>${comment.user.name}</p>
   </small>
   </p>
   </li>`)
   }

   let deleteComment= function(deleteLink){
       $(deleteLink).click(function(e){
           e.preventDefault();

           $.ajax({
               type:'get',
               url:$(deleteLink).prop('href'),
               success: function(data){
                   console.log(data);
                   $(`#comment-${data.data.comment_id}`).remove();
                   heyNoty('success','Comment deleted');
               },error: function(error){
                   console.log(error.responseText);
                   heyNoty('error',error.responseText);
               }
           })
       })
   }
 

   createComment();
   
}
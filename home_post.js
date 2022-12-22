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

    //method to submit the data for new post using AJAX
    let createPost= function()
    {
        let postForm= $('#new-post-form');
        postForm.submit(function(event){
            event.preventDefault();

            $.ajax({
                type:'post',
                url:'/post/create',
                data: postForm.serialize(),
                success: function(data){
                    console.log(data.data);
                    let newPost= showPost(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    heyNoty('success','Post Created');
                    deletePost($(' .delete-post-button',newPost));
                }, error: function(err){
                    console.log(error.responseText);
                    heyNoty('error',error.responseText);
                    
                }
            });
        });
    }
   
    // method to show post using DOM

    let showPost= function(post){
        return $(`<li id="post-${post._id}">
        <p>
             
                   <small>
                         <a class="delete-post-button" href="/post/destroy/${post._id}">Delete</a>
                   </small>
            if( ${post.post_img}){
                <img src="${post.post_img}" alt="no image">
                <p> ${post.content}</p>
               <p> ${post.user.name} </p>   
             }else{   
                <p> ${post.content}</p>
                <p> ${post.user.name} </p>  
    
            } 
       </p>
       <div id="comment-container">
          
                   <form action="/comments/create" id="comment-form" method="POST">
                         <textarea cols="4" rows="4" placeholder="Comment here...." name="post_comment"></textarea>
                         <input type="hidden" name="post" value="${post._id}">
                         <input type="submit" value="comment">
                   </form>
        
    
             <div id="post-comments-list">
                   <ul id="post-comments-${post._id}>
    
                   </ul>
    
             </div>
             
             </div>
       </li>`)
    }


    let deletePost= function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success: function(data){
                        $(`#post-${data.data.post_id}`).remove();
                        heyNoty('success','Post Deleted');
                },error: function(error){
                    console.log(error.responseText);
                    heyNoty('error',error.responseText);
                }
            })
        })
    }

    createPost();

}
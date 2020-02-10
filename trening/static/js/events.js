document.addEventListener('click', e => {
    if (eventIdBase[e.target.id]) {
        eventIdBase[e.target.id]();
    } else if (e.target.className == "gallery-close") {
        eventIdBase.DeleteGalleryImg(e.target.id);
    }
}); 

window.onhashchange = App;

const eventIdBase = {
    'registration': function() {
            CallForm($add_form);
    },
    'entry': function() {
            CallForm($enter_form);
    },
    'exit_form_add': 
            CallForm, 
    'exit_form_enter': 
             CallForm, 
    'create_button': 
            Add,
    'enter_button':
            Enter,
    'user_cancel_button': function() {
        CloseForm(CreateHashArray()[0], "#EditPage");
    },    
    'user_save_button': function() {
        SubmitUserForm(CreateHashArray());
    }, 
    'comment_cancel_button': function() {
        CloseForm(CreateHashArray()[0], "#NewsPage");
    },    
    'comment_save_button': function() {
       SubmitCommentForm(CreateHashArray());
    },  
    'exit':
        Exit, 
    'DeleteGalleryImg': 
        DeleteGalleryImg,
}


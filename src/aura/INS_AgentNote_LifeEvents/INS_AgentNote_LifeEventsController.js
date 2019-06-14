({
    submitTheNote : function(component, event, helper) {
        console.log('controller.submitTheNote');
        helper.callServer(
            component,
            "c.submitNewNote",
            function (response) {
                helper.showToast('Success', 'Note was created successfully!', 'success');
                component.set('v.note', '');
                
                // helper.reloadPage(component);      
                $A.get('e.force:refreshView').fire();                         
                
                // Refresh NextBestOffer component
                var appEvent = $A.get("e.c:INS_RefreshEvent");
                appEvent.fire();
         
                $A.get('e.force:refreshView').fire();
            },
            { 
                'note'   : component.get('v.note'),
                'acctId' : component.get('v.recordId') 
            }
        );
                   
    },
    
})
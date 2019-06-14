({
    callServer: function(component, method, callback, params) {
        var action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // pass returned value to callback function
                callback.call(this, response.getReturnValue());
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    
    showToast : function(title, message, type) {
        console.log('helper.showToast..');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": 'dismissible',
            "duration": 2000
        });
        toastEvent.fire();
    },
    
    navToRecord : function (component, event, helper, recordId) {
        console.log('helper.navToRecord');
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": recordId
        });
        navEvt.fire();
    },
    
    reloadPage : function (component) {
		document.location.reload(true);
    },
    

    getAllTabInfo : function(component, event, helper) {
        console.log('helper.getAllTabInfo..');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getAllTabInfo().then(function(response) {
            console.log(response);
       })
        .catch(function(error) {
            console.log(error);
        });
    },
    
    closeFocusedTab : function(component, event, helper) {
        console.log('helper.closeFocusedTab..');
         var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
        
        helper.navToRecord(component,event,helper);
    
    },
})
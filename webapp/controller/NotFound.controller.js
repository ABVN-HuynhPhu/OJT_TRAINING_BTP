sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], (Controller, UIComponent, History) => {
    "use strict";
    
    return Controller.extend("ui5.quickstart.controller.NotFound", {
        onInit: function() {},
        
        onNavBack: function() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                UIComponent.getRouterFor(this).navTo("EmployeeList", {}, true);
            }
        },
        
        onNavToEmployeeList: function() {
            UIComponent.getRouterFor(this).navTo("EmployeeList");
        }
    });
});
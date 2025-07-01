sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, Device, JSONModel) {
    "use strict";

    return UIComponent.extend("ui5.quickstart.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            // 1. Call base component initialization first
            UIComponent.prototype.init.apply(this, arguments);

            // 2. Set models
            const oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

            const oDataModel = new JSONModel({
                employeeId: "",
                name: "",
                position: "",
                employees: [
                    { department: "RDC",id: "001", name: "Huynh Phu", level: "1", email: "phuynh@abeam.com", gender: "Male", dateOfBirth: "2003-06-06", workingFrom: "2024-07-15" },
                ]
            });
            this.setModel(oDataModel);
            this.getRouter().initialize();

            const oRouter = this.getRouter();
            console.log("Router instance:", oRouter);
            
            if (oRouter && typeof oRouter.getRoutes === "function") {
                console.log("Available routes:", oRouter.getRoutes());
            } else {
                console.error("Router not properly initialized");
            }
        }
    });
});
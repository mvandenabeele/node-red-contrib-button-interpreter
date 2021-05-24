module.exports = function(RED) {
    function ButtonSettingsNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.latitude = n.latitude;
        this.longitude = n.longitude;
    }
    RED.nodes.registerType("buttonsettings",ButtonSettingsNode);
}
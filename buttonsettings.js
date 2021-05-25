module.exports = function(RED) {
    function ButtonSettingsNode(n) {
        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.timeout = n.timeout;
    }
    RED.nodes.registerType("buttonsettings",ButtonSettingsNode);
}
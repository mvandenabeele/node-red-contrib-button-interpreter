module.exports = function(RED) {
    function ButtonInterpreterNode(config) {
        RED.nodes.createNode(this,config);
        this.buttonsettings = this.server = RED.nodes.getNode(config.buttonsettings);

        var last_msg_timestamp = 0;

        var theButtons = {};

        function getButtonInfo( button ) {
            if( !theButtons.hasOwnProperty(button)) {
                theButtons[button] = 
                    {
                        timer_id: 0,
                        click_count: 0,
                        name: button
                    };
            }
            return theButtons[button];
        }

        var timer_ms = 3000;

        function processAction( button, action ) {
            var theBtnInfo = getButtonInfo(button);

            if( theBtnInfo.timer_id ) {
                clearTimeout(theBtnInfo.timer_id);
                theBtnInfo.timer_id = 0;
            }

            if (action === "click" ) {
                theBtnInfo.click_count++;

                theBtnInfo.timer_id = setTimeout( function() {
                    var n = {
                        payload: theBtnInfo.name,
                        action: "click",
                        clickcount: theBtnInfo.click_count
                    };

                    node.send(n);

                    theBtnInfo.timer_id = 0;
                    theBtnInfo.click_count = 0;
                }, timer_ms);
            }
            else if( action === "hold" ) {
                var now = Date.now();
                last_msg_timestamp = now;
            }
            else if( action === "release") {
                var now = Date.now();
                var delta = now - last_msg_timestamp;

                var n = {
                    payload: theBtnInfo.name,
                    action: "hold",
                    delta: delta
                };
                
                node.send(n);
            }
        }

        var node = this;
        node.on('input', function(msg, send, done) {

            // For maximum backwards compatibility, check that send exists.
            // If this node is installed in Node-RED 0.x, it will need to
            // fallback to using `node.send`
            send = send || function() { node.send.apply(node,arguments) }

            var underscore = msg.payload.lastIndexOf("_");
            if( underscore < 0 ) {
                processAction("toggle", "click");
            }
            else {
                var btnName = msg.payload.substr(0, underscore);
                var btnAction = msg.payload.substr(underscore+1);
                
                processAction(btnName, btnAction);
            }

            if (done) {
                done();
            }
            
        });

        node.on('close', function(removed, done) {
            for( const theBtnInfo in theButtons) {

                if( theBtnInfo.timer_id ) {
                    clearTimeout(theBtnInfo.timer_id);
                }
            }

            if( done) {
                done();
            }
        });
    }
    RED.nodes.registerType("buttoninterpreter",ButtonInterpreterNode);
}
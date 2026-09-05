(function() {
    console.log("[Mod] Gamepad Wrapper Initialized");
    
    // Ánh xạ phím ảo với mã phím tương ứng (Mũi tên)
    var KEY_MAP = {
        UP: { code: 'ArrowUp', keyCode: 38 },
        DOWN: { code: 'ArrowDown', keyCode: 40 },
        LEFT: { code: 'ArrowLeft', keyCode: 37 },
        RIGHT: { code: 'ArrowRight', keyCode: 39 }
    };

    var state = { UP: false, DOWN: false, LEFT: false, RIGHT: false };
    var prevState = { UP: false, DOWN: false, LEFT: false, RIGHT: false };

    // Hàm tạo và gửi sự kiện bàn phím giả lập (Fake Keyboard Event)
    function triggerKey(keyDef, isDown) {
        var eventType = isDown ? 'keydown' : 'keyup';
        var event;
        
        try {
            event = new KeyboardEvent(eventType, {
                key: keyDef.code,
                code: keyDef.code,
                keyCode: keyDef.keyCode,
                which: keyDef.keyCode,
                bubbles: true,
                cancelable: true
            });
        } catch (e) {
            // Fallback cho Safari cực cũ không hỗ trợ new KeyboardEvent
            event = document.createEvent('KeyboardEvent');
            event.initKeyboardEvent(eventType, true, true, window, keyDef.code, 0, false, false, false, false);
        }
        
        // Fix tương thích cho một số engine cũ
        Object.defineProperty(event, 'keyCode', { get: function() { return keyDef.keyCode; } });
        Object.defineProperty(event, 'which', { get: function() { return keyDef.keyCode; } });
        
        window.dispatchEvent(event);
        document.dispatchEvent(event);
        
        var canvas = document.querySelector('canvas');
        if (canvas) canvas.dispatchEvent(event);
    }

    function updateGamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        var gpFound = null;
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) { gpFound = gamepads[i]; break; }
        }

        if (gpFound) {
            state.UP = false; state.DOWN = false; state.LEFT = false; state.RIGHT = false;

            // Đọc trạng thái các nút bấm (Sửa lỗi cú pháp ES6 ?. trên trình duyệt cũ)
            if (gpFound.buttons && gpFound.buttons.length > 0) {
                if ((gpFound.buttons[0] && gpFound.buttons[0].pressed) || 
                    (gpFound.buttons[12] && gpFound.buttons[12].pressed)) state.UP = true;
                if (gpFound.buttons[13] && gpFound.buttons[13].pressed) state.DOWN = true;
                if (gpFound.buttons[14] && gpFound.buttons[14].pressed) state.LEFT = true;
                if (gpFound.buttons[15] && gpFound.buttons[15].pressed) state.RIGHT = true;
            }

            // Đọc trạng thái cần gạt (Analog)
            if (gpFound.axes && gpFound.axes.length >= 2) {
                var xAxis = gpFound.axes[0];
                var yAxis = gpFound.axes[1];
                
                if (xAxis < -0.4) state.LEFT = true;
                if (xAxis > 0.4) state.RIGHT = true;
                if (yAxis < -0.4) state.UP = true;
                if (yAxis > 0.4) state.DOWN = true;
            }

            // So sánh và gửi tín hiệu
            for (var key in state) {
                if (state.hasOwnProperty(key)) {
                    if (state[key] !== prevState[key]) {
                        triggerKey(KEY_MAP[key], state[key]);
                        prevState[key] = state[key];
                    }
                }
            }
        }
        
        requestAnimationFrame(updateGamepads);
    }

    window.addEventListener("gamepadconnected", function(e) {
        console.log("[Mod] Gamepad connected: " + e.gamepad.id);
    });

    requestAnimationFrame(updateGamepads);
})();

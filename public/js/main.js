
        // Función para cambiar el fondo aleatoriamente
        window.cambiarFondoAleatorio = function() {
            const fondosDBZ = [
                // Rutas locales de tus imágenes de escenarios de pelea
                './public/img/fondos/1.jpeg',
                './public/img/fondos/2.jpeg',
                './public/img/fondos/3.jpeg',
                './public/img/fondos/4.jpeg',
                './public/img/fondos/5.jpeg',
                './public/img/fondos/6.jpeg',
                './public/img/fondos/7.jpeg',
                './public/img/fondos/8.jpeg',
                './public/img/fondos/9.jpeg'
            ];
            
            // Seleccionar un fondo aleatorio
            const fondoAleatorio = fondosDBZ[Math.floor(Math.random() * fondosDBZ.length)];
            const skyBackground = document.getElementById('skyBackground');
            
            if (skyBackground) {
                // Transición suave al cambiar fondo
                skyBackground.style.opacity = '0';
                
                setTimeout(() => {
                    skyBackground.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${fondoAleatorio}')`;
                    skyBackground.style.backgroundSize = 'cover';
                    skyBackground.style.backgroundPosition = 'center';
                    skyBackground.style.backgroundRepeat = 'no-repeat';
                    skyBackground.style.backgroundAttachment = 'fixed';
                    skyBackground.style.opacity = '1';
                }, 300);
            }
        };
        
        // Cambiar fondo al cargar la página
        window.cambiarFondoAleatorio();
        
        // Script para que las nubes sigan el cursor
        (function() {
            const miniClouds = [
                { el: document.getElementById('miniCloud1'), x: 0, y: 0, offset: 45, speed: 0.1 },
                { el: document.getElementById('miniCloud2'), x: 0, y: 0, offset: 35, speed: 0.08 },
                { el: document.getElementById('miniCloud3'), x: 0, y: 0, offset: 30, speed: 0.06 },
                { el: document.getElementById('miniCloud4'), x: 0, y: 0, offset: 25, speed: 0.04 }
            ];

            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;

            miniClouds.forEach(cloud => {
                if (cloud.el) {
                    cloud.x = mouseX;
                    cloud.y = mouseY;
                    cloud.el.style.left = (mouseX - cloud.offset) + 'px';
                    cloud.el.style.top = (mouseY - cloud.offset / 2) + 'px';
                }
            });

            document.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateMiniClouds() {
                if (miniClouds[0].el) {
                    miniClouds[0].x += (mouseX - miniClouds[0].x) * miniClouds[0].speed;
                    miniClouds[0].y += (mouseY - miniClouds[0].y) * miniClouds[0].speed;
                    miniClouds[0].el.style.left = (miniClouds[0].x - miniClouds[0].offset) + 'px';
                    miniClouds[0].el.style.top = (miniClouds[0].y - miniClouds[0].offset / 2) + 'px';
                }

                for (let i = 1; i < miniClouds.length; i++) {
                    const cloud = miniClouds[i];
                    const prevCloud = miniClouds[i - 1];
                    
                    if (cloud.el && prevCloud.el) {
                        cloud.x += (prevCloud.x - cloud.x) * cloud.speed;
                        cloud.y += (prevCloud.y - cloud.y) * cloud.speed;
                        cloud.el.style.left = (cloud.x - cloud.offset) + 'px';
                        cloud.el.style.top = (cloud.y - cloud.offset / 2) + 'px';
                    }
                }

                requestAnimationFrame(animateMiniClouds);
            }

            animateMiniClouds();
        })();

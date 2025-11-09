// URL del script de Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEUmjqqaswzrWoZpiGzwyhy02ao0x3wF6WVxfMXH6wVgF9RV1rBwBSF2P9MtWN_jfbmg/exec';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const submitBtn = document.getElementById('submitBtn');
    const mensajeDiv = document.getElementById('mensaje');
    const introScreen = document.getElementById('introScreen');
    const introGetStartedBtn = document.getElementById('introGetStartedBtn');
    const homeShowcase = document.getElementById('homeShowcase');
    const homeStartBtn = document.getElementById('homeStartBtn');
    const homeProfileBtn = document.getElementById('homeProfileBtn');
    const homeShowcaseBrands = document.getElementById('homeShowcaseBrands') || document.querySelector('.home-showcase__brands');
    const menuHomeShowcase = document.getElementById('menuHomeShowcase');
    const productDetail = document.getElementById('productDetail');
    const productDetailBackBtn = document.getElementById('productDetailBackBtn');
    const productDetailImage = document.getElementById('productDetailImage');
    const productDetailName = document.getElementById('productDetailName');
    const productDetailRating = document.getElementById('productDetailRating');
    const productDetailDescription = document.getElementById('productDetailDescription');
    const productDetailCapacity = document.getElementById('productDetailCapacity');
    const productDetailSpeed = document.getElementById('productDetailSpeed');
    const productDetailPower = document.getElementById('productDetailPower');
    const productDetailPrice = document.getElementById('productDetailPrice');
    const productDetailBuyBtn = document.querySelector('.product-detail__buy-btn');
    const catalogList = document.getElementById('catalogList');
    const catalogListItems = document.getElementById('catalogListItems');
    const catalogListBackBtn = document.getElementById('catalogListBackBtn');
    const catalogListHomeBtn = document.getElementById('catalogListHomeBtn');
    const catalogListProfileBtn = document.getElementById('catalogListProfileBtn');
    let currentStep = 1;
    let origenDetalle = 'home';
    let ultimaMotoSeleccionada = null;
    const MOTOS_API_URL = 'https://script.google.com/macros/s/AKfycbwMvaKE6Mh8e9vZWcrQTiLeBORPkyeu3TuE1OlpB6wgh5Yl_dk-acHNlxcpx29K0sA5/exec';
    const LOGIN_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxU4ZkKAUYLRG6TdJAxwGk921LcHnBiU2pzxa_Yk6g3h_pCMqUZEjuwXtq3fDChr2oe/exec';
    const REGISTER_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-jI6oMlKNmteiK3XMiYNrzoqSUkYA7wtEuKbirRmTrZCDZXCuLH9JjxTSXF2GowivQg/exec';
    const DEFAULT_BIKE_IMAGE = 'https://i.imgur.com/1Mi2DWr.png';
    const APACHE_BRAND_IMAGE = 'https://i.imgur.com/SIsl6dt.png';
    const FALLBACK_MOTOS = [
        {
            id: 'fallback-1',
            marca: 'TVS',
            linea: 'Apache RTR 200 4V',
            nombre: 'TVS Apache RTR 200 4V',
            precioTexto: 'Q 20,990',
            precioNumero: 20990,
            rating: '4.8',
            descripcion: 'TVS Apache RTR 200 4V. Placas gratis y trámite 100% en línea.',
            cuotas: '24 Cuotas Q 1,050',
            gasto: 'Gasto adm. Q 2,099',
            promocion: 'Placas Gratis + Trámite 100% Línea',
            imagen: 'https://i.imgur.com/IdfA3iK.png'
        },
        {
            id: 'fallback-2',
            marca: 'TVS',
            linea: 'Ronin 225',
            nombre: 'TVS Ronin 225',
            precioTexto: 'Q 29,000',
            precioNumero: 29000,
            rating: '4.6',
            descripcion: 'TVS Ronin 225. Estilo urbano premium con motor de alto desempeño.',
            cuotas: '24 Cuotas Q 1,451',
            gasto: 'Gasto adm. Q 2,900',
            promocion: 'Placas Gratis - Trámite 100% Línea',
            imagen: 'https://i.imgur.com/rt24bUg.png'
        },
        {
            id: 'fallback-3',
            marca: 'TVS',
            linea: 'Raider 125',
            nombre: 'TVS Raider 125',
            precioTexto: 'Q 15,290',
            precioNumero: 15290,
            rating: '4.5',
            descripcion: 'TVS Raider 125. Ahorro de combustible con diseño agresivo.',
            cuotas: '24 Cuotas Q 765',
            gasto: 'Gasto adm. Q 1,529',
            promocion: 'Placas Gratis - Promoción por tiempo limitado',
            imagen: 'https://i.imgur.com/mBf7zDN.png'
        },
        {
            id: 'fallback-4',
            marca: 'TVS',
            linea: 'NTORQ 125',
            nombre: 'TVS NTORQ 125',
            precioTexto: 'Q 14,990',
            precioNumero: 14990,
            rating: '4.4',
            descripcion: 'TVS NTORQ 125. Scooter conectado con estilo deportivo y tecnología SmartXonnect.',
            cuotas: '24 Cuotas Q 750',
            gasto: 'Gasto adm. Q 1,499',
            promocion: 'Placas Gratis + Trámite 100% Línea',
            imagen: 'https://i.imgur.com/G0I4Hqq.png'
        }
    ];
    let motosData = [];
    let lineaSeleccionada = null;
    const numeroDpiInput = document.getElementById('numero_dpi');
    const nitInput = document.getElementById('nit');
    const telefonoInput = document.getElementById('telefono');
    const numeroDpiRegex = /^\d+$/;
    const nitRegex = /^\d+$/;

    function sanitizarInputNumerico(input) {
        if (!input) return;
        input.addEventListener('input', () => {
            const limpio = input.value.replace(/\D/g, '');
            if (input.value !== limpio) {
                input.value = limpio;
            }
        });
    }

    sanitizarInputNumerico(numeroDpiInput);
    sanitizarInputNumerico(nitInput);
    sanitizarInputNumerico(telefonoInput);

    // Verificar que los elementos existan
    if (!form || !submitBtn) {
        console.error('Elementos del formulario no encontrados');
        return;
    }

    // Función para cambiar de paso
    function cambiarPaso(step) {
        // Ocultar todas las secciones del formulario
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Ocultar sección de perfil si existe
        const profileContainer = document.getElementById('section-4');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
        
        // Ocultar sección de Procesos Iniciados si existe
        const section5 = document.getElementById('section-5');
        if (section5) {
            section5.style.display = 'none';
        }
        
        // Ocultar contenedor principal si vamos a la sección 4 o 5
        const mainContainer = document.querySelector('.container');
        if (step === 4 || step === 5) {
            if (mainContainer) {
                mainContainer.style.display = 'none';
            }
        } else {
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
        }

        // Mostrar la sección actual
        if (step === 4) {
            // Mostrar sección de perfil (completamente independiente)
            if (profileContainer) {
                profileContainer.style.display = 'block';
            }
        } else if (step === 5) {
            // Mostrar sección de Procesos Iniciados
            if (section5) {
                section5.style.display = 'block';
            }
            // Mantener header y navButtons visibles
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'block';
            }
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'flex';
            }
        } else {
            // Mostrar sección del formulario
        const currentSection = document.getElementById(`section-${step}`);
        if (currentSection) {
            currentSection.classList.add('active');
            currentSection.style.display = 'block';
            
            // Si es la sección 1, cargar el email del usuario logueado
            if (step === 1) {
                cargarEmailUsuario();
            }
            }
        }

        // Actualizar indicador de progreso solo para pasos 1-3
        if (step <= 3) {
        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('active');
        });
        const currentStepElement = document.querySelector(`.step[data-step="${step}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            }
        }

        // Actualizar botones de navegación
        actualizarBotonesNavegacion(step);

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Función para actualizar botones de navegación
    function actualizarBotonesNavegacion(step) {
        const navButtons = document.getElementById('navButtons');
        
        // Siempre mostrar navbar
        if (navButtons) {
            navButtons.style.display = 'flex';
        }

        // Actualizar estado activo de los iconos
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const itemStep = item.getAttribute('data-step');
            if (itemStep && parseInt(itemStep) === step) {
                item.classList.add('active');
            } else if (step === 4 && item.id === 'navSettings') {
                // Activar botón de configuración cuando estamos en sección 4
                item.classList.add('active');
            }
        });
    }

    // Función para validar y avanzar
    function validarYAvanzar(step) {
        const section = document.getElementById(`section-${step}`);
        const inputs = section.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef5350';
            } else {
                input.style.borderColor = '#e0e0e0';
            }
        });

        if (isValid) {
            cambiarPaso(step + 1);
        } else {
            mostrarModal('Por favor completa todos los campos requeridos');
        }
    }

    // Botón para ir a la sección 2
    const nextToStep2 = document.getElementById('nextToStep2');
    if (nextToStep2) {
        nextToStep2.addEventListener('click', function() {
            validarYAvanzar(1);
        });
    }

    // Botones de navegación inferior con iconos
    const navItems = document.querySelectorAll('.nav-item[data-step]');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            if (step === 1) {
                cambiarPaso(1);
            } else if (step === 2 && currentStep === 1) {
                validarYAvanzar(1);
            } else if (step === 2 && currentStep === 2) {
                cambiarPaso(2);
            } else if (step === 3 && currentStep === 3) {
                // Ya estamos en verificación, no hacer nada
                cambiarPaso(3);
            }
        });
    });
    
    // Botón de Configuración
    const navSettings = document.getElementById('navSettings');
    if (navSettings) {
        navSettings.addEventListener('click', function() {
            cambiarPaso(4);
        });
    }

    // Función para guardar datos de la sección 1 en localStorage
    function guardarDatosSeccion1() {
        const numeroDpiValor = numeroDpiInput ? numeroDpiInput.value.replace(/\D/g, '') : '';
        const nitValor = nitInput ? nitInput.value.replace(/\D/g, '') : '';
        const telefonoValor = telefonoInput ? telefonoInput.value.replace(/\D/g, '') : '';
        const datos = {
            nombre_completo: document.getElementById('nombre_completo').value,
            numero_dpi: numeroDpiValor,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            nit: nitValor,
            email: document.getElementById('email').value,
            telefono: telefonoValor
        };
        localStorage.setItem('formulario_datos_seccion1', JSON.stringify(datos));
    }

    // Función para cargar datos de la sección 1 desde localStorage
    function cargarDatosSeccion1() {
        const datosGuardados = localStorage.getItem('formulario_datos_seccion1');
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                document.getElementById('nombre_completo').value = datos.nombre_completo || '';
                document.getElementById('numero_dpi').value = (datos.numero_dpi || '').toString().replace(/\D/g, '');
                document.getElementById('fecha_nacimiento').value = datos.fecha_nacimiento || '';
                document.getElementById('nit').value = (datos.nit || '').toString().replace(/\D/g, '');
                const emailField = document.getElementById('email');
                if (emailField) {
                    const emailGuardado = datos.email || emailField.dataset.baseEmail || '';
                    emailField.value = emailGuardado;
                    emailField.dataset.baseEmail = emailGuardado.split('/')[0] || emailField.dataset.baseEmail || '';
                }
                document.getElementById('telefono').value = (datos.telefono || '').toString().replace(/\D/g, '');
            } catch (e) {
                console.error('Error al cargar datos guardados:', e);
            }
        }
    }

    // Guardar datos cuando el usuario escriba en los campos de la sección 1
    const camposSeccion1 = ['nombre_completo', 'numero_dpi', 'fecha_nacimiento', 'nit', 'email', 'telefono'];
    camposSeccion1.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', guardarDatosSeccion1);
            campo.addEventListener('change', guardarDatosSeccion1);
        }
    });

    // Cargar datos guardados al iniciar
    cargarDatosSeccion1();

    // Crear botones personalizados para inputs de archivo
    function crearBotonesArchivoPersonalizados() {
        // Incluir todos los inputs de archivo, incluyendo los de estados_cuenta_group
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            // Verificar si ya tiene un botón personalizado
            const existingButton = input.parentNode.querySelector('.custom-file-button[data-for="' + input.id + '"]');
            if (existingButton) {
                return;
            }
            
            // Crear botón personalizado
            const customButton = document.createElement('button');
            customButton.type = 'button';
            customButton.className = 'custom-file-button';
            customButton.setAttribute('data-for', input.id);
            customButton.textContent = 'Seleccionar';
            
            // Insertar botón después del input
            input.parentNode.insertBefore(customButton, input.nextSibling);
            
            // Hacer clic en el botón personalizado abre el input
            customButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                input.click();
            });
            
            // Actualizar el texto del botón cuando se selecciona un archivo
            input.addEventListener('change', function() {
                if (this.files && this.files.length > 0) {
                    customButton.textContent = 'Archivo seleccionado';
                    customButton.style.background = '#4caf50';
                    customButton.style.color = 'white';
                    customButton.style.borderColor = '#4caf50';
                } else {
                    customButton.textContent = 'Seleccionar';
                    customButton.style.background = 'white';
                    customButton.style.color = '#082d48';
                    customButton.style.borderColor = '#082d48';
                }
            });
        });
    }

    // Crear botones personalizados
    crearBotonesArchivoPersonalizados();
    
    // También crear cuando se cambia a la sección 2 o cuando se muestra estados_cuenta_group
    const section2 = document.getElementById('section-2');
    const estadosCuentaGroup = document.getElementById('estados_cuenta_group');
    
    const observer = new MutationObserver(function(mutations) {
        if ((section2 && section2.style.display !== 'none') || 
            (estadosCuentaGroup && estadosCuentaGroup.style.display !== 'none')) {
            setTimeout(crearBotonesArchivoPersonalizados, 100);
        }
    });
    
    if (section2) {
        observer.observe(section2, { attributes: true, attributeFilter: ['style'] });
    }
    if (estadosCuentaGroup) {
        observer.observe(estadosCuentaGroup, { attributes: true, attributeFilter: ['style'] });
    }

    // Referencias a pantallas de autenticación
    const authWelcome = document.getElementById('auth-welcome');
    const authLogin = document.getElementById('auth-login');
    const authRegister = document.getElementById('auth-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerStatus = document.getElementById('registerStatus');
    const registerStatusText = document.getElementById('registerStatusText');
    const mainContainer = document.querySelector('.container');
    
    // Verificar si hay sesión guardada
    const usuarioLogueado = localStorage.getItem('usuario_logueado');
    const tieneSesion = usuarioLogueado && usuarioLogueado !== 'null' && usuarioLogueado !== '';
    
    // Inicializar: verificar sesión o mostrar pantalla de bienvenida
    if (tieneSesion) {
        // Si hay sesión guardada, mostrar perfil directamente
        // Ocultar contenedor principal
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        const header = document.querySelector('.header');
        if (header) {
            header.style.display = 'none';
        }
        const navButtons = document.getElementById('navButtons');
        if (navButtons) {
            navButtons.style.display = 'none';
        }
        if (introScreen) {
            introScreen.style.display = 'none';
        }
        // Ocultar pantallas de autenticación
        if (authWelcome) authWelcome.style.display = 'none';
        if (authLogin) authLogin.style.display = 'none';
        if (authRegister) authRegister.style.display = 'none';
        // Mostrar pantalla principal o perfil
        if (homeShowcase) {
            homeShowcase.style.display = 'flex';
            if (productDetail) {
                productDetail.style.display = 'none';
            }
            if (catalogList) {
                catalogList.style.display = 'none';
            }
        } else {
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'block';
            }
            cargarDatosPerfil();
            actualizarBotonesNavegacion(4);
        }
    } else {
        // Si no hay sesión, mostrar la pantalla de introducción como prioridad
        if (introScreen) {
            introScreen.style.display = 'flex';
            if (mainContainer) mainContainer.style.display = 'none';
            if (authWelcome) authWelcome.style.display = 'none';
            if (authLogin) authLogin.style.display = 'none';
            if (authRegister) authRegister.style.display = 'none';
            const header = document.querySelector('.header');
            if (header) header.style.display = 'none';
            const navButtons = document.getElementById('navButtons');
            if (navButtons) navButtons.style.display = 'none';
            if (homeShowcase) homeShowcase.style.display = 'none';
            if (productDetail) productDetail.style.display = 'none';
            if (catalogList) catalogList.style.display = 'none';
        } else if (homeShowcase) {
            if (mainContainer) mainContainer.style.display = 'none';
            if (authWelcome) authWelcome.style.display = 'none';
            if (authLogin) authLogin.style.display = 'none';
            if (authRegister) authRegister.style.display = 'none';
            const header = document.querySelector('.header');
            if (header) header.style.display = 'none';
            const navButtons = document.getElementById('navButtons');
            if (navButtons) navButtons.style.display = 'none';
            homeShowcase.style.display = 'flex';
            if (productDetail) productDetail.style.display = 'none';
            if (catalogList) catalogList.style.display = 'none';
        } else if (authWelcome && mainContainer) {
            mainContainer.style.display = 'none';
            authWelcome.style.display = 'flex';
        } else {
            cambiarPaso(1);
        }
    }

    // Manejar cambio entre carta laboral y estados de cuenta
    const tipoDocumentoRadios = document.querySelectorAll('input[name="tipo_documento"]');
    const cartaLaboralGroup = document.getElementById('carta_laboral_group');
    const cartaLaboralInput = document.getElementById('carta_laboral');
    const estadoCuenta1 = document.getElementById('estado_cuenta_1');
    const estadoCuenta2 = document.getElementById('estado_cuenta_2');
    const estadoCuenta3 = document.getElementById('estado_cuenta_3');

    tipoDocumentoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'carta_laboral') {
                cartaLaboralGroup.style.display = 'block';
                estadosCuentaGroup.style.display = 'none';
                estadosCuentaGroup.style.setProperty('display', 'none', 'important');
                cartaLaboralInput.required = true;
                estadoCuenta1.required = false;
                estadoCuenta2.required = false;
                estadoCuenta3.required = false;
            } else if (this.value === 'estados_cuenta') {
                cartaLaboralGroup.style.display = 'none';
                estadosCuentaGroup.style.display = 'flex';
                estadosCuentaGroup.style.setProperty('display', 'flex', 'important');
                cartaLaboralInput.required = false;
                estadoCuenta1.required = true;
                estadoCuenta2.required = true;
                estadoCuenta3.required = true;
            }
            // Crear botones personalizados cuando cambia el tipo de documento
            setTimeout(crearBotonesArchivoPersonalizados, 100);
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ocultar sección 2 y mostrar pantalla de carga
        const section2 = document.getElementById('section-2');
        if (section2) section2.style.display = 'none';
        
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
        // Deshabilitar botón mientras se procesa
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Ocultar mensaje si existe
        if (mensajeDiv) {
        mensajeDiv.style.display = 'none';
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'mensaje';
        }

        try {
            // Obtener datos del formulario
            const formData = new FormData(form);
            const nombreCompleto = formData.get('nombre_completo');
            const numeroDpi = formData.get('numero_dpi');
            const fechaNacimiento = formData.get('fecha_nacimiento');
            const nit = formData.get('nit');
            const email = formData.get('email');
            const telefono = formData.get('telefono');
            const tipoDocumento = formData.get('tipo_documento');

            // Obtener todas las imágenes con sus nombres específicos
            const imagenesData = {
                dpi_frente: formData.get('dpi_frente'),
                dpi_reverso: formData.get('dpi_reverso'),
                recibo_luz: formData.get('recibo_luz'),
                carta_laboral: tipoDocumento === 'carta_laboral' ? formData.get('carta_laboral') : null,
                estado_cuenta_1: tipoDocumento === 'estados_cuenta' ? formData.get('estado_cuenta_1') : null,
                estado_cuenta_2: tipoDocumento === 'estados_cuenta' ? formData.get('estado_cuenta_2') : null,
                estado_cuenta_3: tipoDocumento === 'estados_cuenta' ? formData.get('estado_cuenta_3') : null
            };

            // Convertir imágenes a base64 con sus etiquetas
            const imagenesBase64 = [];
            const nombresImagenes = [];
            const tiposImagenes = [];

            for (const [tipo, archivo] of Object.entries(imagenesData)) {
                if (archivo && archivo.size > 0) {
                    const base64 = await convertirImagenABase64(archivo);
                    imagenesBase64.push(base64);
                    nombresImagenes.push(archivo.name);
                    tiposImagenes.push(tipo);
                }
            }

            const numeroDpiLimpio = (numeroDpi || '').toString().replace(/\D/g, '');
            const nitLimpio = (nit || '').toString().replace(/\D/g, '');
            const telefonoLimpio = (telefono || '').toString().replace(/\D/g, '');

            if (!numeroDpiLimpio) {
                mostrarModal('El campo NO. DPI sólo admite números.');
                const errorValidacion = new Error('DPI inválido');
                errorValidacion.isValidation = true;
                throw errorValidacion;
            }

            if (!nitLimpio) {
                mostrarModal('El campo NIT sólo admite números.');
                const errorValidacion = new Error('NIT inválido');
                errorValidacion.isValidation = true;
                throw errorValidacion;
            }

            // Crear objeto con todos los datos
            const datos = {
                nombre_completo: nombreCompleto,
                numero_dpi: numeroDpiLimpio,
                fecha_nacimiento: fechaNacimiento,
                nit: nitLimpio,
                email: email,
                telefono: telefonoLimpio,
                tipo_documento: tipoDocumento,
                action: 'add_user',
                timestamp: new Date().toISOString(),
                imagenes: imagenesBase64,
                nombres_imagenes: nombresImagenes,
                tipos_imagenes: tiposImagenes
            };

            const motoSeleccionada = (() => {
                if (ultimaMotoSeleccionada) {
                    return {
                        nombre: ultimaMotoSeleccionada.nombre || '',
                        imagen: ultimaMotoSeleccionada.imagen || ''
                    };
                }
                try {
                    const guardada = localStorage.getItem('formulario_moto_seleccionada');
                    return guardada ? JSON.parse(guardada) : null;
                } catch (error) {
                    console.error('Error al leer moto seleccionada almacenada:', error);
                    return null;
                }
            })();

            if (motoSeleccionada) {
                datos.moto_nombre = motoSeleccionada.nombre || '';
                datos.moto_imagen = motoSeleccionada.imagen || '';
            }

            // Enviar datos usando iframe oculto
            enviarDatosConIframe(datos);

        } catch (error) {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar y Continuar';
            if (error && error.isValidation) {
                return;
            }
            mostrarError('Error al procesar el formulario: ' + (error && error.message ? error.message : 'Error desconocido'));
        }
    });

    // Función para convertir imagen a base64
    function convertirImagenABase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    // Función para enviar datos usando iframe oculto
    function enviarDatosConIframe(datos) {
        // Crear formulario temporal
        const formTemp = document.createElement('form');
        formTemp.method = 'POST';
        formTemp.action = SCRIPT_URL;
        formTemp.target = 'hiddenIframe';
        formTemp.style.display = 'none';

            // Agregar todos los campos como inputs ocultos
        for (const key in datos) {
            if (datos.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                
                // Si es un array, convertir a JSON string
                if (Array.isArray(datos[key])) {
                    input.value = JSON.stringify(datos[key]);
                } else if (datos[key] !== null && datos[key] !== undefined) {
                    input.value = datos[key];
                } else {
                    continue; // Saltar campos null o undefined
                }
                
                formTemp.appendChild(input);
            }
        }

        // Agregar formulario al body y enviar
        document.body.appendChild(formTemp);
        
        // Escuchar cuando el iframe termine de cargar
        const iframe = document.getElementById('hiddenIframe');
        if (!iframe) {
            console.error('Iframe no encontrado');
            return;
        }
        
        iframe.onload = function() {
            // Ocultar pantalla de carga
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            try {
                // Intentar leer la respuesta del iframe
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const respuesta = iframeDoc.body.textContent || iframeDoc.body.innerText;
                
                if (respuesta.includes('✅')) {
                    mostrarConfirmacion();
                } else if (respuesta.includes('❌')) {
                    const mensajeLimpio = respuesta.replace(/❌/g, '').trim();
                    mostrarError('Error: ' + mensajeLimpio);
                } else {
                    mostrarConfirmacion();
                }
            } catch (e) {
                // Si hay error de CORS, asumir éxito
                mostrarConfirmacion();
            }
            
            // Limpiar y resetear
            document.body.removeChild(formTemp);
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Guardar y Continuar';
        };

        formTemp.submit();
    }

    function enviarRegistroConIframe(datos, onSuccess, onError) {
        const iframe = document.getElementById('hiddenIframe');
        if (!iframe) {
            console.error('Iframe no encontrado');
            if (typeof onError === 'function') {
                onError('No se pudo completar el registro.');
            }
            return;
        }

        const formTemp = document.createElement('form');
        formTemp.method = 'POST';
        formTemp.action = REGISTER_SCRIPT_URL;
        formTemp.target = 'hiddenIframe';
        formTemp.style.display = 'none';
        formTemp.style.position = 'absolute';
        formTemp.style.left = '-9999px';

        for (const key in datos) {
            if (Object.prototype.hasOwnProperty.call(datos, key)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = datos[key];
                formTemp.appendChild(input);
            }
        }

        const limpiar = () => {
            if (formTemp && formTemp.parentNode) {
                formTemp.parentNode.removeChild(formTemp);
            }
            iframe.onload = null;
        };

        iframe.onload = function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const respuesta = iframeDoc && iframeDoc.body ? (iframeDoc.body.textContent || iframeDoc.body.innerText || '') : '';
                if (respuesta.includes('✅')) {
                    if (typeof onSuccess === 'function') onSuccess(respuesta);
                } else if (respuesta.includes('❌')) {
                    const mensajeLimpio = respuesta.replace(/❌/g, '').trim();
                    if (typeof onError === 'function') onError(mensajeLimpio || 'No fue posible registrar la cuenta.');
                } else {
                    if (typeof onSuccess === 'function') onSuccess(respuesta);
                }
            } catch (error) {
                if (typeof onSuccess === 'function') onSuccess();
            } finally {
                limpiar();
            }
        };

        document.body.appendChild(formTemp);
        formTemp.submit();
    }

    // Función para mostrar confirmación
    function mostrarConfirmacion() {
        // Ocultar pantalla de carga
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Mostrar pantalla de confirmación usando la función cambiarPaso
        cambiarPaso(3);
        
        // Limpiar datos guardados
            localStorage.removeItem('formulario_datos_seccion1');
        }
    
    // Función para mostrar error
    function mostrarError(mensaje) {
        // Ocultar pantalla de carga
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Volver a la sección 2 con mensaje de error
        cambiarPaso(2);
        
        // Mostrar mensaje de error si el elemento existe
        if (mensajeDiv) {
            mensajeDiv.textContent = mensaje;
            mensajeDiv.className = 'mensaje error';
            mensajeDiv.style.display = 'block';
        } else {
            // Si no existe el elemento, mostrar modal
            mostrarModal(mensaje);
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar y Continuar';
    }
    
    // Manejar botón "Registros" - lleva a Procesos Iniciados (sección 5)
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            // Ocultar sección de confirmación
            const section3 = document.getElementById('section-3');
            if (section3) {
                section3.style.display = 'none';
            }
            
            // Ocultar contenedor principal
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = 'none';
            }
            
            // Mantener header y navButtons visibles
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'block';
            }
            
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'flex';
            }
            
            // Mostrar sección de Procesos Iniciados
            const section5 = document.getElementById('section-5');
            if (section5) {
                section5.style.display = 'block';
            }
            
            // Cargar procesos
            cargarProcesos();
        });
    }
    
    // Manejar botón "Perfil" - lleva al perfil (sección 4)
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Ocultar sección de confirmación
            const section3 = document.getElementById('section-3');
            if (section3) {
                section3.style.display = 'none';
            }
            
            // Ocultar contenedor principal
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = 'none';
            }
            
            // Ocultar header y navButtons
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'none';
            }
            
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'none';
            }
            
            // Mostrar sección de perfil
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'block';
            }
            
            // Cargar datos del perfil
            cargarDatosPerfil();
        });
    }
    
    // Variable para almacenar el callback del modal
    let modalCallback = null;
    
    // Función para mostrar modal de advertencia
    function mostrarModal(mensaje, callback) {
        const modal = document.getElementById('warningModal');
        const modalMessage = document.getElementById('modalMessage');
        
        if (modal && modalMessage) {
            modalMessage.textContent = mensaje;
            modal.style.display = 'flex';
            modalCallback = callback || null;
        }
    }
    
    // Función para cerrar modal
    function cerrarModal() {
        const modal = document.getElementById('warningModal');
        if (modal) {
            modal.style.display = 'none';
            // Ejecutar callback si existe
            if (modalCallback) {
                modalCallback();
                modalCallback = null;
            }
        }
    }
    
    // Event listeners para cerrar modal
    const modalOkBtn = document.getElementById('modalOkBtn');
    const warningModal = document.getElementById('warningModal');
    
    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', cerrarModal);
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    if (warningModal) {
        warningModal.addEventListener('click', function(e) {
            if (e.target === warningModal) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('warningModal');
            if (modal && modal.style.display === 'flex') {
                cerrarModal();
            }
        }
    });
    
    // Cargar email del usuario logueado en el campo de email
    function cargarEmailUsuario() {
        const emailField = document.getElementById('email');
        if (!emailField) return;
        
        let usuarioEmail = '';
        
        // Intentar obtener el email del usuario logueado (de login o registro)
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        if (usuarioLogueado) {
            try {
                const datos = JSON.parse(usuarioLogueado);
                usuarioEmail = datos.email || '';
            } catch (e) {
                console.error('Error al parsear usuario logueado:', e);
            }
        }
        
        // Si no hay usuario logueado, intentar obtener del formulario de registro
        if (!usuarioEmail) {
            const datosGuardados = localStorage.getItem('formulario_datos_seccion1');
            if (datosGuardados) {
                try {
                    const datos = JSON.parse(datosGuardados);
                    usuarioEmail = datos.email || '';
                } catch (e) {
                    console.error('Error al cargar datos del formulario:', e);
                }
            }
        }
        
        // Actualizar el campo de email
        if (usuarioEmail) {
            const emailActual = emailField.value;
            let emailFormateado = usuarioEmail;
            if (emailActual && emailActual.includes('/')) {
                const [correoBase, ...resto] = emailActual.split('/');
                const sufijo = resto.join('/').trim();
                emailFormateado = `${usuarioEmail}/${sufijo}`;
            }
            emailField.value = emailFormateado;
            emailField.dataset.baseEmail = usuarioEmail;
        }
    }
    
    // Cargar datos del usuario en la sección de perfil
    function cargarDatosPerfil() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        let usuarioEmail = '';
        let usuarioNombre = '';
        
        // Intentar obtener el email del usuario logueado (de login o registro)
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        if (usuarioLogueado) {
            try {
                const datos = JSON.parse(usuarioLogueado);
                usuarioEmail = datos.email || '';
                // Extraer nombre del email (parte antes del @)
                if (usuarioEmail) {
                    usuarioNombre = usuarioEmail.split('@')[0].toUpperCase();
                }
            } catch (e) {
                console.error('Error al parsear usuario logueado:', e);
            }
        }
        
        // Si no hay usuario logueado, intentar obtener del formulario de registro
        if (!usuarioEmail) {
            const datosGuardados = localStorage.getItem('formulario_datos_seccion1');
            if (datosGuardados) {
                try {
                    const datos = JSON.parse(datosGuardados);
                    usuarioEmail = datos.email || '';
                    usuarioNombre = datos.nombre_completo ? datos.nombre_completo.toUpperCase() : '';
                    if (usuarioEmail && !usuarioNombre) {
                        usuarioNombre = usuarioEmail.split('@')[0].toUpperCase();
                    }
                } catch (e) {
                    console.error('Error al cargar datos del formulario:', e);
                }
            }
        }
        
        // Si todavía no hay email, intentar obtener del email del registro
        if (!usuarioEmail) {
            // Buscar cualquier email guardado en localStorage
            const keys = Object.keys(localStorage);
            for (let key of keys) {
                try {
                    const value = localStorage.getItem(key);
                    if (value && value.includes('@')) {
                        const parsed = JSON.parse(value);
                        if (parsed.email || parsed.Email) {
                            usuarioEmail = parsed.email || parsed.Email;
                            usuarioNombre = usuarioEmail.split('@')[0].toUpperCase();
                            break;
                        }
                    }
                } catch (e) {
                    // Continuar buscando
                }
            }
        }
        
        // Actualizar el perfil
        if (profileName) {
            if (usuarioNombre) {
                profileName.textContent = usuarioNombre;
            } else if (usuarioEmail) {
                profileName.textContent = usuarioEmail.split('@')[0].toUpperCase();
            } else {
                profileName.textContent = 'USUARIO';
            }
        }
        
        if (profileEmail) {
            if (usuarioEmail) {
                profileEmail.textContent = usuarioEmail;
            } else {
                profileEmail.textContent = 'usuario@email.com';
            }
        }
        
        // Verificar si el usuario es admin
        verificarAdmin();
    }
    
    // Cargar datos cuando se muestra la sección 4
    const section4 = document.getElementById('section-4');
    if (section4) {
        const observer = new MutationObserver(function(mutations) {
            if (section4.style.display === 'block') {
                cargarDatosPerfil();
            }
        });
        observer.observe(section4, { attributes: true, attributeFilter: ['style'] });
    }
    
    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            mostrarModal('¿Estás seguro de que deseas cerrar sesión?', function() {
                localStorage.clear();

                if (form) {
                    form.reset();
                }

                const emailField = document.getElementById('email');
                if (emailField) {
                    emailField.value = '';
                    emailField.dataset.baseEmail = '';
                }

                if (homeShowcase) homeShowcase.style.display = 'none';
                if (productDetail) productDetail.style.display = 'none';
                if (catalogList) catalogList.style.display = 'none';
                if (introScreen) introScreen.style.display = 'none';

                const section4 = document.getElementById('section-4');
                if (section4) section4.style.display = 'none';
                const section5 = document.getElementById('section-5');
                if (section5) section5.style.display = 'none';
                const section6 = document.getElementById('section-6');
                if (section6) section6.style.display = 'none';

                const mainContainer = document.querySelector('.container');
                if (mainContainer) mainContainer.style.display = 'none';

                const header = document.querySelector('.header');
                if (header) header.style.display = 'none';

                const navButtons = document.getElementById('navButtons');
                if (navButtons) navButtons.style.display = 'none';

                if (authWelcome) authWelcome.style.display = 'none';
                if (authRegister) authRegister.style.display = 'none';

                if (authLogin) {
                    authLogin.style.display = 'flex';
                } else if (authWelcome) {
                    authWelcome.style.display = 'flex';
                }

                currentStep = 1;
            });
        });
    }
    
    // Botón "Enviar Documentos" - lleva a la sección 1
    const menuProfile = document.getElementById('menuProfile');
    if (menuProfile) {
        menuProfile.addEventListener('click', function() {
            // Ocultar sección de perfil
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'none';
            }
            
            // Mostrar contenedor principal
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
            
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'block';
            }
            
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'flex';
            }
            
            // Ir a la sección 1
            cambiarPaso(1);
        });
    }
    
    // Botón "Procesos Iniciados" - abre la sección 5
    const menuMessages = document.getElementById('menuMessages');
    if (menuMessages) {
        menuMessages.addEventListener('click', function() {
            // Ocultar sección de perfil
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'none';
            }
            
            // Ocultar contenedor principal
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = 'none';
            }
            
            // Mantener header y navButtons visibles
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'block';
            }
            
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'flex';
            }
            
            // Mostrar sección de Procesos Iniciados
            const section5 = document.getElementById('section-5');
            if (section5) {
                section5.style.display = 'block';
            }
            
            // Cargar procesos
            cargarProcesos();
        });
    }
    
    // Función para cargar procesos en la sección "Procesos Iniciados"
    function cargarProcesos() {
        const procesosList = document.getElementById('procesosList');
        if (!procesosList) return;
        
        procesosList.innerHTML = '<p style="text-align: center; color: #666;">Cargando procesos...</p>';
        
        // Obtener datos del usuario logueado
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        let usuarioEmail = '';
        let esAdmin = false;
        
        if (usuarioLogueado) {
            try {
                const datos = JSON.parse(usuarioLogueado);
                usuarioEmail = datos.email || '';
                esAdmin = datos.esAdmin === true;
            } catch (e) {
                console.error('Error al parsear usuario logueado:', e);
            }
        }
        
        // Hacer petición al script de Google Apps Script para obtener todos los registros
        const REGISTROS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0CXxCSpmL5BiVwLLjP6ACCJgqJ0xpLBhCJR01avXVSq9Qoio6yraIDsnNDFqR8KuD/exec';
        
        fetch(REGISTROS_SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data && data.data.length > 0) {
                    // Si es admin, mostrar todos; si no, filtrar solo los del usuario
                    let registrosFiltrados = data.data;
                    
                    if (!esAdmin && usuarioEmail) {
                        // Filtrar solo los registros del usuario actual
                        // Comparar por NIT que parece contener el email
                        // Quitar /aprobado o /denegado para comparar solo el email base
                        registrosFiltrados = data.data.filter(registro => {
                            const nit = (registro['NIT'] || '').toString().trim().toLowerCase();
                            // Quitar /aprobado o /denegado del NIT para comparar solo el email base
                            const nitBase = nit.endsWith('/aprobado') || nit.endsWith('/denegado')
                                ? nit.replace('/aprobado', '').replace('/denegado', '')
                                : nit;
                            return nitBase === usuarioEmail.toLowerCase();
                        });
                    }
                    
                    if (registrosFiltrados.length > 0) {
                        let html = '';
                        registrosFiltrados.forEach((registro, index) => {
                            const idUnico = registro['ID Único'] || '';
                            const nombreCompleto = registro['Nombre Completo'] || '';
                            const dpi = registro['NO. DPI'] || '';
                            const tipoDocumento = registro['Tipo Documento'] || '';
                            const timestamp = registro['Timestamp'] || '';
                            const nit = (registro['NIT'] || '').toString().trim();
                            
                            // Determinar estado basado en el NIT (si tiene /aprobado o /denegado)
                            let estado = 'PENDING';
                            let estadoTexto = 'PENDIENTE';
                            let estadoColor = '#082d48';
                            
                            if (nit.endsWith('/aprobado')) {
                                estado = 'APPROVED';
                                estadoTexto = 'APROBADO';
                                estadoColor = '#4caf50';
                            } else if (nit.endsWith('/denegado')) {
                                estado = 'DENIED';
                                estadoTexto = 'DENEGADO';
                                estadoColor = '#f44336';
                            } else if (timestamp === 'aprobado' || timestamp.toLowerCase().includes('aprobado')) {
                                estado = 'APPROVED';
                                estadoTexto = 'APROBADO';
                                estadoColor = '#4caf50';
                            } else if (timestamp === 'denegado' || timestamp.toLowerCase().includes('denegado')) {
                                estado = 'DENIED';
                                estadoTexto = 'DENEGADO';
                                estadoColor = '#f44336';
                            }
                            
                            const progressWidth = estado === 'APPROVED' ? '100%' : estado === 'DENIED' ? '0%' : '50%';
                            
                            html += `
                                <div class="process-card" style="margin-bottom: 16px;">
                                    <div class="process-status-tag" style="background: ${estadoColor};">${estadoTexto}</div>
                                    <div class="process-route">
                                        <span class="route-from">${nombreCompleto}</span>
                                        <span class="route-arrow">→</span>
                                        <span class="route-to">${tipoDocumento}</span>
                                    </div>
                                    <div class="process-order-id">ID: ${idUnico}</div>
                                    <div class="process-progress-bar">
                                        <div class="process-progress-fill" style="width: ${progressWidth};"></div>
                                    </div>
                                    <div class="process-footer">
                                        <div class="process-label">DPI: ${dpi}</div>
                                        <div class="process-date">${timestamp}</div>
                                    </div>
                                </div>
                            `;
                        });
                        procesosList.innerHTML = html;
                    } else {
                        procesosList.innerHTML = '<p style="text-align: center; color: #666;">No tienes procesos iniciados</p>';
                    }
                } else {
                    procesosList.innerHTML = '<p style="text-align: center; color: #666;">No hay procesos</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar procesos:', error);
                procesosList.innerHTML = '<p style="text-align: center; color: #dc3545;">Error al cargar procesos</p>';
            });
    }
    
    // Botón "Volver" en sección 5 - regresa a la sección 4
    const backFromSection5Btn = document.getElementById('backFromSection5Btn');
    if (backFromSection5Btn) {
        backFromSection5Btn.addEventListener('click', function() {
            // Ocultar sección 5
            const section5 = document.getElementById('section-5');
            if (section5) {
                section5.style.display = 'none';
            }
            
            // Mostrar sección 4 (perfil)
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'block';
            }
        });
    }
    
    // Verificar si el usuario es admin y mostrar/ocultar botón Admin
    function verificarAdmin() {
        const menuAdmin = document.getElementById('menuAdmin');
        if (!menuAdmin) return;
        
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        if (!usuarioLogueado) {
            menuAdmin.style.display = 'none';
            return;
        }
        
        try {
            const datos = JSON.parse(usuarioLogueado);
            const esAdmin = datos.esAdmin === true;
            
            if (esAdmin) {
                menuAdmin.style.display = 'flex';
            } else {
                menuAdmin.style.display = 'none';
            }
        } catch (e) {
            menuAdmin.style.display = 'none';
        }
    }
    
    // Verificar admin al cargar la página y cuando se muestra la sección 4
    verificarAdmin();
    
    // Botón "Admin" - abre la sección 6
    const menuAdmin = document.getElementById('menuAdmin');
    if (menuAdmin) {
        menuAdmin.addEventListener('click', function() {
            // Ocultar sección de perfil
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'none';
            }
            
            // Ocultar contenedor principal
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = 'none';
            }
            
            // Mantener header y navButtons visibles
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'block';
            }
            
            const navButtons = document.getElementById('navButtons');
            if (navButtons) {
                navButtons.style.display = 'flex';
            }
            
            // Mostrar sección de Admin
            const section6 = document.getElementById('section-6');
            if (section6) {
                section6.style.display = 'block';
            }
            
            // Cargar lista de usuarios
            cargarUsuariosAdmin();
        });
    }
    
    // Botón "Volver" en sección 6 - regresa a la sección 4
    const backFromSection6Btn = document.getElementById('backFromSection6Btn');
    if (backFromSection6Btn) {
        backFromSection6Btn.addEventListener('click', function() {
            // Ocultar sección 6
            const section6 = document.getElementById('section-6');
            if (section6) {
                section6.style.display = 'none';
            }
            
            // Mostrar sección 4 (perfil)
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'block';
            }
        });
    }
    
    // Variable global para almacenar los datos de los registros
    let registrosAdminData = [];
    
    // Función para cargar usuarios en la sección de Admin
    function cargarUsuariosAdmin() {
        const adminUsersList = document.getElementById('adminUsersList');
        if (!adminUsersList) return;
        
        adminUsersList.innerHTML = '<p>Cargando usuarios...</p>';
        
        // Hacer petición al script de Google Apps Script para obtener todos los registros
        const REGISTROS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0CXxCSpmL5BiVwLLjP6ACCJgqJ0xpLBhCJR01avXVSq9Qoio6yraIDsnNDFqR8KuD/exec';
        
        fetch(REGISTROS_SCRIPT_URL)
            .then(response => response.json())
            .then(data => {
                // Guardar los datos globalmente para usarlos en los botones
                registrosAdminData = data.data || [];
                
                if (data.success && data.data && data.data.length > 0) {
                    let html = '';
                    data.data.forEach((registro, index) => {
                        const idUnico = registro['ID Único'] || '';
                        const nombreCompleto = registro['Nombre Completo'] || '';
                        const dpi = registro['NO. DPI'] || '';
                        const fechaNacimiento = registro['Fecha de Nacimiento'] || '';
                        const nit = registro['NIT'] || '';
                        const telefono = registro['Teléfono'] || '';
                        const tipoDocumento = registro['Tipo Documento'] || '';
                        const timestamp = registro['Timestamp'] || '';
                        
                        html += `
                            <div class="process-card" style="margin-bottom: 16px;">
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <div style="color: white; font-weight: 600; font-size: 16px; margin-bottom: 4px;">${nombreCompleto}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>ID Único:</strong> ${idUnico}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>NO. DPI:</strong> ${dpi}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>Fecha de Nacimiento:</strong> ${fechaNacimiento}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>NIT:</strong> ${nit}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>Teléfono:</strong> ${telefono}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>Tipo Documento:</strong> ${tipoDocumento}</div>
                                    <div style="color: #999; font-size: 14px;"><strong>Timestamp:</strong> ${timestamp}</div>
                                    <div style="display: flex; gap: 12px; margin-top: 12px;">
                                        <button type="button" class="admin-btn-approve" data-id="${idUnico}" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #4caf50; color: white; font-weight: 600; cursor: pointer; font-size: 14px;">Aprobar</button>
                                        <button type="button" class="admin-btn-deny" data-id="${idUnico}" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #f44336; color: white; font-weight: 600; cursor: pointer; font-size: 14px;">Denegar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    adminUsersList.innerHTML = html;
                    
                    // Agregar event listeners a los botones
                    const approveButtons = adminUsersList.querySelectorAll('.admin-btn-approve');
                    const denyButtons = adminUsersList.querySelectorAll('.admin-btn-deny');
                    
                    approveButtons.forEach(btn => {
                        btn.addEventListener('click', function() {
                            const idUnico = this.getAttribute('data-id');
                            // Buscar el registro completo para obtener el email
                            const registro = registrosAdminData.find(r => r['ID Único'] === idUnico);
                            if (!registro) {
                                mostrarModal('No se encontró el registro');
                                return;
                            }
                            
                            mostrarModal('¿Estás seguro de que deseas aprobar este registro?', function() {
                                aprobarRegistro(idUnico, registro);
                            });
                        });
                    });
                    
                    denyButtons.forEach(btn => {
                        btn.addEventListener('click', function() {
                            const idUnico = this.getAttribute('data-id');
                            // Buscar el registro completo para obtener el email
                            const registro = registrosAdminData.find(r => r['ID Único'] === idUnico);
                            if (!registro) {
                                mostrarModal('No se encontró el registro');
                                return;
                            }
                            
                            mostrarModal('¿Estás seguro de que deseas denegar este registro?', function() {
                                denegarRegistro(idUnico, registro);
                            });
                        });
                    });
                } else {
                    adminUsersList.innerHTML = '<p style="color: #666;">No hay registros</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                adminUsersList.innerHTML = '<p style="color: #dc3545;">Error al cargar usuarios</p>';
            });
    }
    
    // Función para aprobar un registro
    function aprobarRegistro(idUnico, registro) {
        const email = registro['Email'] || registro['NIT'] || '';
        const nombreCompleto = registro['Nombre Completo'] || '';
        
        if (!email) {
            mostrarModal('No se encontró el email del usuario');
            return;
        }
        
        // Obtener el email base (sin /aprobado o /denegado)
        let emailBase = email.toString().trim();
        if (emailBase.endsWith('/aprobado') || emailBase.endsWith('/denegado')) {
            emailBase = emailBase.split('/')[0];
        }
        
        const emailActualizado = emailBase + '/aprobado';
        
        // Enviar datos al Google Apps Script para aprobar
        const APPROVE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyevpdbaXbh0mMa3lbWwcJnfRxS8joc2-MjOD2K6sRcPd702V-gfbez90KkVWAo4PvnNw/exec';
        
        // Crear formulario temporal para enviar los datos
        let iframe = document.getElementById('hiddenIframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hiddenIframe';
            iframe.name = 'hiddenIframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        const formTemp = document.createElement('form');
        formTemp.method = 'POST';
        formTemp.action = APPROVE_SCRIPT_URL;
        formTemp.target = 'hiddenIframe';
        formTemp.style.display = 'none';
        formTemp.style.position = 'absolute';
        formTemp.style.left = '-9999px';
        
        // Agregar campos
        const inputAction = document.createElement('input');
        inputAction.type = 'hidden';
        inputAction.name = 'action';
        inputAction.value = 'approve_registry';
        formTemp.appendChild(inputAction);
        
        const inputIdUnico = document.createElement('input');
        inputIdUnico.type = 'hidden';
        inputIdUnico.name = 'id_unico';
        inputIdUnico.value = idUnico;
        formTemp.appendChild(inputIdUnico);
        
        const inputEmail = document.createElement('input');
        inputEmail.type = 'hidden';
        inputEmail.name = 'email';
        inputEmail.value = emailActualizado;
        formTemp.appendChild(inputEmail);
        
        const inputNombre = document.createElement('input');
        inputNombre.type = 'hidden';
        inputNombre.name = 'nombre_completo';
        inputNombre.value = nombreCompleto;
        formTemp.appendChild(inputNombre);
        
        const inputEmailOriginal = document.createElement('input');
        inputEmailOriginal.type = 'hidden';
        inputEmailOriginal.name = 'email_original';
        inputEmailOriginal.value = emailBase;
        formTemp.appendChild(inputEmailOriginal);
        
        document.body.appendChild(formTemp);
        formTemp.submit();
        
        // Remover formulario después de enviar
        setTimeout(function() {
            if (formTemp && formTemp.parentNode) {
                formTemp.parentNode.removeChild(formTemp);
            }
        }, 1000);
        
        mostrarModal('Registro aprobado. Se enviará un correo al usuario.');
        
        // Recargar la lista después de un tiempo
        setTimeout(function() {
            cargarUsuariosAdmin();
        }, 2000);
    }
    
    // Función para denegar un registro
    function denegarRegistro(idUnico, registro) {
        const email = registro['Email'] || registro['NIT'] || '';
        const nombreCompleto = registro['Nombre Completo'] || '';
        
        if (!email) {
            mostrarModal('No se encontró el email del usuario');
            return;
        }
        
        // Obtener el email base (sin /aprobado o /denegado)
        let emailBase = email.toString().trim();
        if (emailBase.endsWith('/aprobado') || emailBase.endsWith('/denegado')) {
            emailBase = emailBase.split('/')[0];
        }
        
        const emailActualizado = emailBase + '/denegado';
        
        // Enviar datos al Google Apps Script para denegar
        const DENY_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyevpdbaXbh0mMa3lbWwcJnfRxS8joc2-MjOD2K6sRcPd702V-gfbez90KkVWAo4PvnNw/exec';
        
        // Crear formulario temporal para enviar los datos
        let iframe = document.getElementById('hiddenIframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hiddenIframe';
            iframe.name = 'hiddenIframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        const formTemp = document.createElement('form');
        formTemp.method = 'POST';
        formTemp.action = DENY_SCRIPT_URL;
        formTemp.target = 'hiddenIframe';
        formTemp.style.display = 'none';
        formTemp.style.position = 'absolute';
        formTemp.style.left = '-9999px';
        
        // Agregar campos
        const inputAction = document.createElement('input');
        inputAction.type = 'hidden';
        inputAction.name = 'action';
        inputAction.value = 'deny_registry';
        formTemp.appendChild(inputAction);
        
        const inputIdUnico = document.createElement('input');
        inputIdUnico.type = 'hidden';
        inputIdUnico.name = 'id_unico';
        inputIdUnico.value = idUnico;
        formTemp.appendChild(inputIdUnico);
        
        const inputEmail = document.createElement('input');
        inputEmail.type = 'hidden';
        inputEmail.name = 'email';
        inputEmail.value = emailActualizado;
        formTemp.appendChild(inputEmail);
        
        const inputNombre = document.createElement('input');
        inputNombre.type = 'hidden';
        inputNombre.name = 'nombre_completo';
        inputNombre.value = nombreCompleto;
        formTemp.appendChild(inputNombre);
        
        const inputEmailOriginal = document.createElement('input');
        inputEmailOriginal.type = 'hidden';
        inputEmailOriginal.name = 'email_original';
        inputEmailOriginal.value = emailBase;
        formTemp.appendChild(inputEmailOriginal);
        
        document.body.appendChild(formTemp);
        formTemp.submit();
        
        // Remover formulario después de enviar
        setTimeout(function() {
            if (formTemp && formTemp.parentNode) {
                formTemp.parentNode.removeChild(formTemp);
            }
        }, 1000);
        
        mostrarModal('Registro denegado. Se enviará un correo al usuario.');
        
        // Recargar la lista después de un tiempo
        setTimeout(function() {
            cargarUsuariosAdmin();
        }, 2000);
    }
    
    // Botón "Configuración" - abre modal de configuración
    const menuSettings = document.getElementById('menuSettings');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    function abrirModalConfiguracion() {
        if (settingsModal) {
            settingsModal.style.display = 'flex';
        }
    }
    
    function cerrarModalConfiguracion() {
        if (settingsModal) {
            settingsModal.style.display = 'none';
        }
    }
    
    if (menuSettings) {
        menuSettings.addEventListener('click', abrirModalConfiguracion);
    }
    
    if (closeSettingsModalBtn) {
        closeSettingsModalBtn.addEventListener('click', cerrarModalConfiguracion);
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    if (settingsModal) {
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                cerrarModalConfiguracion();
            }
        });
    }
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (settingsModal && settingsModal.style.display === 'flex') {
                cerrarModalConfiguracion();
            }
        }
    });
    
    // Botón "Borrar Cuenta"
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            cerrarModalConfiguracion();
            mostrarModal('¿Estás seguro de que deseas borrar tu cuenta? Esta acción no se puede deshacer.', function() {
                // Obtener email del usuario logueado
                const usuarioLogueado = localStorage.getItem('usuario_logueado');
                if (!usuarioLogueado) {
                    mostrarModal('No se encontró información del usuario');
                    return;
                }
                
                try {
                    const datos = JSON.parse(usuarioLogueado);
                    const email = datos.email || '';
                    
                    if (!email) {
                        mostrarModal('No se encontró el email del usuario');
                        return;
                    }
                    
                    // Crear formulario temporal para eliminar el usuario
                    const formTemp = document.createElement('form');
                    formTemp.method = 'POST';
                    formTemp.action = REGISTER_SCRIPT_URL;
                    formTemp.target = 'hiddenIframe';
                    formTemp.style.display = 'none';
                    formTemp.style.position = 'absolute';
                    formTemp.style.left = '-9999px';
                    
                    // Agregar campos al formulario
                    const inputEmail = document.createElement('input');
                    inputEmail.type = 'hidden';
                    inputEmail.name = 'Email';
                    inputEmail.value = email;
                    formTemp.appendChild(inputEmail);
                    
                    const inputAction = document.createElement('input');
                    inputAction.type = 'hidden';
                    inputAction.name = 'action';
                    inputAction.value = 'delete_user';
                    formTemp.appendChild(inputAction);
                    
                    // Agregar formulario al body
                    document.body.appendChild(formTemp);
                    
                    // Enviar formulario
                    formTemp.submit();
                    
                    // Remover formulario temporal después de enviar
                    setTimeout(function() {
                        if (formTemp && formTemp.parentNode) {
                            formTemp.parentNode.removeChild(formTemp);
                        }
                    }, 1000);
                    
                    // Limpiar localStorage y recargar después de un tiempo
                    setTimeout(function() {
                        localStorage.clear();
                        window.location.reload();
                    }, 1500);
                    
                } catch (error) {
                    console.error('Error al borrar cuenta:', error);
                    mostrarModal('Error al borrar la cuenta. Intenta nuevamente.');
                }
            });
        });
    }
    
    // Navegación entre pantallas de autenticación
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    const goToRegisterBtn = document.getElementById('goToRegisterBtn');
    const backFromLoginBtn = document.getElementById('backFromLoginBtn');
    const backFromRegisterBtn = document.getElementById('backFromRegisterBtn');
    const switchToRegisterFromLogin = document.getElementById('switchToRegisterFromLogin');
    const switchToLoginFromRegister = document.getElementById('switchToLoginFromRegister');
    
    function mostrarAuthScreen(screen) {
        // Ocultar todas las pantallas de auth
        if (authWelcome) authWelcome.style.display = 'none';
        if (authLogin) authLogin.style.display = 'none';
        if (authRegister) authRegister.style.display = 'none';
        if (introScreen) introScreen.style.display = 'none';
        if (homeShowcase) homeShowcase.style.display = 'none';
        if (productDetail) productDetail.style.display = 'none';
        if (catalogList) catalogList.style.display = 'none';
        if (homeShowcase) homeShowcase.style.display = 'none';
        if (productDetail) productDetail.style.display = 'none';
        if (catalogList) catalogList.style.display = 'none';
        
        // Ocultar contenedor principal
        const mainContainer = document.querySelector('.container');
        if (mainContainer) mainContainer.style.display = 'none';
        
        // Mostrar la pantalla solicitada
        if (screen === 'welcome' && authWelcome) {
            authWelcome.style.display = 'flex';
        } else if (screen === 'login' && authLogin) {
            authLogin.style.display = 'flex';
        } else if (screen === 'register' && authRegister) {
            authRegister.style.display = 'flex';
        }
    }
    
    function volverAlFormulario() {
        // Ocultar todas las pantallas de auth
        if (authWelcome) authWelcome.style.display = 'none';
        if (authLogin) authLogin.style.display = 'none';
        if (authRegister) authRegister.style.display = 'none';
        if (introScreen) introScreen.style.display = 'none';
        if (homeShowcase) homeShowcase.style.display = 'none';
        
        // Mostrar contenedor principal
        const mainContainer = document.querySelector('.container');
        if (mainContainer) mainContainer.style.display = 'block';
    }
    
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => mostrarAuthScreen('login'));
    }
    
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', () => mostrarAuthScreen('register'));
    }
    
    if (backFromLoginBtn) {
        backFromLoginBtn.addEventListener('click', () => mostrarAuthScreen('welcome'));
    }
    
    if (backFromRegisterBtn) {
        backFromRegisterBtn.addEventListener('click', () => mostrarAuthScreen('welcome'));
    }
    
    if (switchToRegisterFromLogin) {
        switchToRegisterFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarAuthScreen('register');
        });
    }
    
    if (switchToLoginFromRegister) {
        switchToLoginFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarAuthScreen('login');
        });
    }

    function manejarLoginExitoso(email, esAdmin) {
        const usuario = {
            email,
            esAdmin
        };
        localStorage.setItem('usuario_logueado', JSON.stringify(usuario));

        try {
            const datosGuardados = localStorage.getItem('formulario_datos_seccion1');
            const datos = datosGuardados ? JSON.parse(datosGuardados) : {};
            datos.email = email;
            localStorage.setItem('formulario_datos_seccion1', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando el email tras login:', error);
        }

        cargarEmailUsuario();
        cargarDatosPerfil();
        mostrarVistaPrincipalTrasLogin();
    }

    function mostrarVistaPrincipalTrasLogin() {
        if (introScreen) introScreen.style.display = 'none';
        if (authWelcome) authWelcome.style.display = 'none';
        if (authLogin) authLogin.style.display = 'none';
        if (authRegister) authRegister.style.display = 'none';
        if (productDetail) productDetail.style.display = 'none';
        if (catalogList) catalogList.style.display = 'none';

        const header = document.querySelector('.header');
        if (header) header.style.display = 'block';

        const navButtons = document.getElementById('navButtons');
        if (navButtons) navButtons.style.display = 'flex';

        if (homeShowcase) {
            homeShowcase.style.display = 'flex';
        } else if (mainContainer) {
            mainContainer.style.display = 'block';
            cambiarPaso(1);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const emailValor = emailInput ? emailInput.value.trim() : '';
            const passwordValor = passwordInput ? passwordInput.value.trim() : '';

            if (!emailValor || !passwordValor) {
                mostrarModal('Por favor ingresa tu correo y contraseña para continuar.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.textContent;
                submitBtn.textContent = 'Validando...';
            }

            try {
                const response = await fetch(LOGIN_SCRIPT_URL);
                if (!response.ok) {
                    throw new Error(`Error de red (${response.status})`);
                }
                const payload = await response.json();
                if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
                    throw new Error('Respuesta inesperada al validar credenciales');
                }

                const registro = payload.data.find(item => {
                    const emailItem = (item.Email || '').toString().trim().toLowerCase();
                    const passwordItem = (item.Contraseña || '').toString().trim();
                    const passwordBase = passwordItem.replace(/\/admin/gi, '').trim();
                    return emailItem === emailValor.toLowerCase() && passwordBase === passwordValor;
                });

                if (!registro) {
                    mostrarModal('Credenciales incorrectas. Verifica tu correo y contraseña.');
                    return;
                }

                const passwordItem = (registro.Contraseña || '').toString().trim();
                const esAdmin = /\/admin/i.test(passwordItem);
                const emailNormalizado = (registro.Email || '').toString().trim();

                manejarLoginExitoso(emailNormalizado, esAdmin);
            } catch (error) {
                console.error('Error durante el login:', error);
                mostrarModal('No fue posible validar tus credenciales. Inténtalo nuevamente en unos minutos.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Iniciar Sesión';
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = registerForm.querySelector('input[name="Email"]');
            const passwordInput = registerForm.querySelector('input[name="Contraseña"]');
            const confirmInput = document.getElementById('registerConfirmPassword');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const emailValor = emailInput ? emailInput.value.trim() : '';
            const passwordValor = passwordInput ? passwordInput.value.trim() : '';
            const confirmValor = confirmInput ? confirmInput.value.trim() : '';

            if (!emailValor || !passwordValor || !confirmValor) {
                mostrarModal('Completa todos los campos para registrarte.');
                return;
            }

            if (passwordValor !== confirmValor) {
                mostrarModal('Las contraseñas no coinciden.');
                return;
            }

            if (registerStatus) {
                registerStatus.style.display = 'flex';
                registerStatus.classList.remove('success');
            }
            if (registerStatusText) {
                registerStatusText.textContent = 'Creando cuenta...';
            }
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.textContent;
                submitBtn.textContent = 'Registrando...';
            }

            const datosRegistro = {
                action: 'register_user',
                Email: emailValor,
                Contraseña: passwordValor
            };

            enviarRegistroConIframe(datosRegistro, function() {
                if (registerStatus) registerStatus.classList.add('success');
                if (registerStatusText) registerStatusText.textContent = 'Cuenta creada correctamente. Iniciando sesión...';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Registrarse';
                }
                setTimeout(function() {
                    if (registerStatus) registerStatus.style.display = 'none';
                    const esAdmin = /\/admin/i.test(passwordValor);
                    const emailNormalizado = emailValor.trim();
                    manejarLoginExitoso(emailNormalizado, esAdmin);
                    registerForm.reset();
                }, 800);
            }, function(mensajeError) {
                if (registerStatus) registerStatus.style.display = 'none';
                if (registerStatus) registerStatus.classList.remove('success');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Registrarse';
                }
                mostrarModal(mensajeError || 'No fue posible registrar la cuenta. Inténtalo más tarde.');
            });
        });
    }

    if (introGetStartedBtn) {
        introGetStartedBtn.addEventListener('click', function() {
            if (introScreen) {
                introScreen.style.display = 'none';
            }
            if (productDetail) {
                productDetail.style.display = 'none';
            }
            if (catalogList) {
                catalogList.style.display = 'none';
            }
            if (homeShowcase) {
                homeShowcase.style.display = 'none';
            }
            if (authWelcome) {
                authWelcome.style.display = 'flex';
            } else if (mainContainer) {
                mainContainer.style.display = 'block';
                cambiarPaso(1);
            }
        });
    }

    function extraerNumero(texto) {
        if (!texto) return 0;
        const limpio = texto.toString().replace(/[^\d]/g, '');
        return limpio ? Number(limpio) : 0;
    }

    function parseLineaInfo(lineaCruda) {
        const texto = (lineaCruda || '').toString().trim();
        if (!texto) {
            return { texto: '', image: null };
        }
        const httpIndex = texto.indexOf('http');
        if (httpIndex === -1) {
            return { texto, image: null };
        }
        const label = texto.slice(0, httpIndex).replace(/\/+$/g, '').trim();
        const image = texto.slice(httpIndex).trim();
        return {
            texto: label || texto,
            image: image || null
        };
    }

    function limpiarUrlImagen(valor) {
        if (!valor) return '';
        return valor.toString().replace(/\[\/?img\]/gi, '').trim();
    }

    function normalizarMoto(item, index, prefix = 'api') {
        const marca = item?.marca || '';
        const lineaInfo = parseLineaInfo(item?.['línea'] || item?.linea || '');
        const linea = lineaInfo.texto;
        const nombre = [marca, linea].filter(Boolean).join(' ').trim() || 'Motocicleta';
        const precioTexto = item?.contado || 'Precio a consultar';
        const precioNumero = extraerNumero(precioTexto);
        const rating = item?.rating || (4 + Math.random()).toFixed(1);
        const descripcionPartes = [nombre];
        if (item?.promoción) descripcionPartes.push(item.promoción);
        const descripcion = descripcionPartes.filter(Boolean).join('. ');
        return {
            id: item?.id || `${prefix}-${index}`,
            marca,
            linea,
            nombre,
            precioTexto,
            precioNumero,
            rating,
            descripcion: descripcion || 'Consulta condiciones con nuestros asesores.',
            cuotas: item?.cuotas || 'Sin cuotas disponibles',
            gasto: item?.gasto_administrativo || 'Sin gasto administrativo',
            promocion: item?.promoción || 'Sin promoción vigente',
            imagen: limpiarUrlImagen(item?.imagen) || DEFAULT_BIKE_IMAGE,
            lineaImagen: limpiarUrlImagen(lineaInfo.image)
        };
    }

    function obtenerDatosFuente() {
        return motosData.length ? motosData : FALLBACK_MOTOS;
    }

    function seleccionarAleatorias(array, cantidad) {
        const copia = array.slice();
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia.slice(0, cantidad);
    }

    function obtenerLineaBase(linea) {
        const texto = (linea || '').toString().trim();
        if (!texto) return '';
        const primerToken = texto.split(/\s+/)[0];
        return primerToken || '';
    }

    function formatearEtiquetaLinea(linea) {
        const base = obtenerLineaBase(linea);
        if (!base) return '';
        if (base === base.toUpperCase()) {
            return base;
        }
        return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
    }

    function normalizarLineaTexto(linea) {
        return obtenerLineaBase(linea).toLowerCase();
    }

    function formatearTituloCard(nombre) {
        if (!nombre) return '';
        return nombre.replace(/\s*\(/, '<br>(');
    }

    function renderBrandButtons() {
        if (!homeShowcaseBrands) return;
        const fuente = obtenerDatosFuente();
        const lineasMap = new Map();

        fuente.forEach(moto => {
            const lineaKey = normalizarLineaTexto(moto.linea || moto.nombre);
            if (!lineaKey) return;
            const etiqueta = formatearEtiquetaLinea(moto.linea || moto.nombre) || 'Línea';
            const imagen = moto?.lineaImagen || null;
            const existente = lineasMap.get(lineaKey);
            if (existente) {
                if (!existente.image && imagen) {
                    existente.image = imagen;
                }
            } else {
                lineasMap.set(lineaKey, {
                    label: etiqueta,
                    image: imagen
                });
            }
        });

        if (lineaSeleccionada && !lineasMap.has(lineaSeleccionada)) {
            lineaSeleccionada = null;
        }

        homeShowcaseBrands.innerHTML = '';

        const fragment = document.createDocumentFragment();

        const crearBoton = (key, info) => {
            const label = info?.label || 'Línea';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'home-showcase__brand';
            if (key === lineaSeleccionada || (!key && lineaSeleccionada === null)) {
                button.classList.add('active');
            }

            const imagenDisponible = info?.image || (key === 'apache' ? APACHE_BRAND_IMAGE : null);
            if (imagenDisponible && key !== null) {
                const img = document.createElement('img');
                img.src = imagenDisponible;
                img.alt = label;
                img.loading = 'lazy';
                img.className = 'home-showcase__brand-icon';
                button.appendChild(img);
            } else {
                button.classList.add('home-showcase__brand--text');
                const labelSpan = document.createElement('span');
                labelSpan.className = 'home-showcase__brand-text';
                labelSpan.textContent = label;
                button.appendChild(labelSpan);
            }

            button.addEventListener('click', () => {
                if (key === null) {
                    lineaSeleccionada = null;
                } else if (lineaSeleccionada === key) {
                    lineaSeleccionada = null;
                } else {
                    lineaSeleccionada = key;
                }
                renderBrandButtons();
                renderHomeCards();
            });

            fragment.appendChild(button);
        };

        crearBoton(null, { label: 'Popular' });

        if (lineasMap.size) {
            const lineasOrdenadas = Array.from(lineasMap.entries()).sort((a, b) =>
                (a[1].label || '').localeCompare(b[1].label || '', 'es', { sensitivity: 'base' })
            );
            lineasOrdenadas.forEach(([key, info]) => crearBoton(key, info));
        }

        homeShowcaseBrands.appendChild(fragment);
    }

    function mostrarDetalleMoto(moto, origen = 'home') {
        if (!productDetail) return;
        origenDetalle = origen;
        ultimaMotoSeleccionada = moto;
        if (homeShowcase) homeShowcase.style.display = 'none';
        if (catalogList) catalogList.style.display = 'none';
        if (introScreen) introScreen.style.display = 'none';

        if (productDetailImage) productDetailImage.src = moto.imagen;
        if (productDetailName) productDetailName.textContent = moto.nombre;
        if (productDetailRating) productDetailRating.textContent = `⭐ ${moto.rating}`;
        if (productDetailDescription) {
            productDetailDescription.textContent = moto.descripcion.replace(/-?\s*Placas\s+Gratis\s*-?/gi, '').replace(/\s{2,}/g, ' ').trim();
        }
        if (productDetailCapacity) productDetailCapacity.textContent = moto.cuotas;
        if (productDetailSpeed) productDetailSpeed.textContent = moto.gasto;
        if (productDetailPower) productDetailPower.textContent = 'Placas Gratis';
        if (productDetailPrice) productDetailPrice.textContent = moto.precioTexto;

        productDetail.style.display = 'flex';

        const detalleImagenWrapper = productDetailImage?.closest('.product-detail__image');
        if (detalleImagenWrapper) {
            detalleImagenWrapper.style.transform = 'translateY(-30%)';
        }

        const detalleCard = document.querySelector('.product-detail__card');
        if (detalleCard) {
            detalleCard.style.transform = 'translateY(-30%)';
        }
    }

    function renderHomeCards() {
        const container = document.querySelector('.home-showcase__cards');
        if (!container) return;
        const fuente = obtenerDatosFuente();
        const datosFiltrados = lineaSeleccionada
            ? fuente.filter(moto => normalizarLineaTexto(moto.linea || moto.nombre) === lineaSeleccionada)
            : fuente;
        const datosParaMostrar = lineaSeleccionada ? datosFiltrados : seleccionarAleatorias(fuente, Math.min(4, fuente.length));

        container.innerHTML = '';
        const debeSerCompacto = !datosParaMostrar.length || datosParaMostrar.length <= 2;
        container.classList.toggle('home-showcase__cards--compact', debeSerCompacto);
        container.classList.toggle('home-showcase__cards--recommended', !lineaSeleccionada);

        if (!datosParaMostrar.length) {
            const mensaje = document.createElement('p');
            mensaje.className = 'home-showcase__empty';
            mensaje.textContent = 'No hay motos disponibles para esta línea.';
            container.appendChild(mensaje);
            return;
        }

        datosParaMostrar.forEach(moto => {
            const card = document.createElement('article');
            card.className = 'home-showcase__card home-showcase__card--featured';
            card.innerHTML = `
                <button type="button" class="home-showcase__card-fav" aria-label="Agregar a favoritos">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                        <path d="M12 21s-6.5-4.35-9-7.92C1.86 10.65 2.07 7.46 4.4 5.4c2.33-2.05 5.47-1.53 7.6.92 2.13-2.45 5.27-2.97 7.6-.92 2.33 2.06 2.54 5.25 1.4 7.68C18.5 16.65 12 21 12 21z"></path>
                    </svg>
                </button>
                <div class="home-showcase__card-image">
                    <img src="${moto.imagen}" alt="${moto.nombre}" loading="lazy">
                </div>
                <div class="home-showcase__card-body">
                    <h4>${formatearTituloCard(moto.nombre)}</h4>
                    <div class="home-showcase__card-meta">
                        <span class="home-showcase__card-price">${moto.precioTexto}</span>
                        <span class="home-showcase__card-rating">${moto.rating}</span>
                    </div>
                </div>
            `;
            const favBtn = card.querySelector('.home-showcase__card-fav');
            if (favBtn) {
                favBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    favBtn.classList.toggle('active');
                });
            }
            card.addEventListener('click', () => mostrarDetalleMoto(moto, 'home'));
            container.appendChild(card);
        });
    }

    function renderCatalogCards() {
        if (!catalogListItems) return;
        const datos = obtenerDatosFuente();
        catalogListItems.innerHTML = '';
        datos.forEach(moto => {
            const item = document.createElement('article');
            item.className = 'catalog-list__item';
            item.innerHTML = `
                <img src="${moto.imagen}" alt="${moto.nombre}" class="catalog-list__item-img">
                <div class="catalog-list__item-body">
                    <div>
                        <h4 class="catalog-list__item-title">${formatearTituloCard(moto.nombre)}</h4>
                        <div class="catalog-list__item-rating">⭐ ${moto.rating}</div>
                    </div>
                    <div class="catalog-list__item-btns">
                        <div class="catalog-list__item-price">${moto.precioTexto}</div>
                        <button type="button" class="catalog-list__buy-btn">Comprar</button>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => mostrarDetalleMoto(moto, 'catalog'));
            catalogListItems.appendChild(item);
        });
    }

    function mostrarCatalogo() {
        renderCatalogCards();
        if (catalogList) catalogList.style.display = 'flex';
        if (homeShowcase) homeShowcase.style.display = 'none';
        if (productDetail) productDetail.style.display = 'none';
        if (introScreen) introScreen.style.display = 'none';
    }

    async function cargarMotosDesdeAPI() {
        try {
            const response = await fetch(MOTOS_API_URL);
            const data = await response.json();
            if (data && data.success && Array.isArray(data.data)) {
                motosData = data.data.map((item, index) => normalizarMoto(item, index, 'api'));
                renderBrandButtons();
                renderHomeCards();
                renderCatalogCards();
            }
        } catch (error) {
            console.error('Error cargando motos desde API:', error);
        }
    }

    renderBrandButtons();
    renderHomeCards();
    renderCatalogCards();
    cargarMotosDesdeAPI();

    if (productDetailBackBtn) {
        productDetailBackBtn.addEventListener('click', function() {
            if (productDetail) {
                productDetail.style.display = 'none';
            }
            if (origenDetalle === 'catalog' && catalogList) {
                catalogList.style.display = 'flex';
            } else if (homeShowcase) {
                renderHomeCards();
                homeShowcase.style.display = 'flex';
            }
            origenDetalle = 'home';
        });
    }

    if (productDetailBuyBtn) {
        productDetailBuyBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const emailField = document.getElementById('email');
            const motoNombre = productDetailName ? productDetailName.textContent.trim() : '';
            const motoImagen = ultimaMotoSeleccionada?.imagen || (productDetailImage ? productDetailImage.src : '');
            if (emailField) {
                const baseEmail = emailField.dataset.baseEmail || emailField.value.split('/')[0].trim();
                emailField.dataset.baseEmail = baseEmail;
                if (motoNombre) {
                    const nuevoEmail = `${baseEmail}/${motoNombre}`;
                    emailField.value = nuevoEmail;
                    emailField.dispatchEvent(new Event('input', { bubbles: true }));
                    emailField.dispatchEvent(new Event('change', { bubbles: true }));

                    try {
                        const datosGuardados = localStorage.getItem('formulario_datos_seccion1');
                        const datos = datosGuardados ? JSON.parse(datosGuardados) : {};
                        datos.email = nuevoEmail;
                        localStorage.setItem('formulario_datos_seccion1', JSON.stringify(datos));
                    } catch (e) {
                        console.error('Error guardando email con moto:', e);
                    }
                }
            }

            try {
                const payloadMoto = {
                    nombre: motoNombre,
                    imagen: motoImagen,
                    timestamp: Date.now()
                };
                localStorage.setItem('formulario_moto_seleccionada', JSON.stringify(payloadMoto));
            } catch (error) {
                console.error('Error guardando moto seleccionada:', error);
            }

            if (productDetail) productDetail.style.display = 'none';
            if (homeShowcase) homeShowcase.style.display = 'none';
            if (catalogList) catalogList.style.display = 'none';
            if (introScreen) introScreen.style.display = 'none';

            const section4 = document.getElementById('section-4');
            if (section4) section4.style.display = 'none';

            const mainContainer = document.querySelector('.container');
            if (mainContainer) mainContainer.style.display = 'block';

            const header = document.querySelector('.header');
            if (header) header.style.display = 'block';

            const navButtons = document.getElementById('navButtons');
            if (navButtons) navButtons.style.display = 'flex';

            cambiarPaso(1);
        });
    }

    if (catalogListBackBtn) {
        catalogListBackBtn.addEventListener('click', function() {
            if (catalogList) catalogList.style.display = 'none';
            renderHomeCards();
            if (homeShowcase) homeShowcase.style.display = 'flex';
            origenDetalle = 'home';
        });
    }

    if (catalogListHomeBtn) {
        catalogListHomeBtn.addEventListener('click', function() {
            if (catalogList) catalogList.style.display = 'none';
            if (productDetail) productDetail.style.display = 'none';
            renderHomeCards();
            if (homeShowcase) homeShowcase.style.display = 'flex';
            origenDetalle = 'home';
        });
    }

    if (catalogListProfileBtn) {
        catalogListProfileBtn.addEventListener('click', function() {
            if (catalogList) catalogList.style.display = 'none';
            if (productDetail) productDetail.style.display = 'none';
            const section4 = document.getElementById('section-4');
            if (section4) section4.style.display = 'block';
            if (homeShowcase) homeShowcase.style.display = 'none';
            if (introScreen) introScreen.style.display = 'none';
            const header = document.querySelector('.header');
            const navButtons = document.getElementById('navButtons');
            if (header) header.style.display = 'none';
            if (navButtons) navButtons.style.display = 'none';
            cargarDatosPerfil();
            actualizarBotonesNavegacion(4);
            origenDetalle = 'home';
        });
    }

    if (homeStartBtn) {
        homeStartBtn.addEventListener('click', mostrarCatalogo);
    }

    if (homeProfileBtn) {
        homeProfileBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (productDetail) productDetail.style.display = 'none';
            if (catalogList) catalogList.style.display = 'none';
            if (homeShowcase) homeShowcase.style.display = 'none';
            if (introScreen) introScreen.style.display = 'none';
            const section4 = document.getElementById('section-4');
            if (section4) {
                section4.style.display = 'block';
                cargarDatosPerfil();
            }
            const header = document.querySelector('.header');
            if (header) header.style.display = 'none';
            const navButtons = document.getElementById('navButtons');
            if (navButtons) navButtons.style.display = 'none';
            actualizarBotonesNavegacion(4);
        });
    }

    menuHomeShowcase.addEventListener('click', function() {
        const section4 = document.getElementById('section-4');
        if (section4) {
            section4.style.display = 'none';
        }
        if (homeShowcase) {
            renderHomeCards();
            homeShowcase.style.display = 'flex';
        }
        if (productDetail) {
            productDetail.style.display = 'none';
        }
    });
});


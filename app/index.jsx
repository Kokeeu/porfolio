import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated as AnimatedNative,
  Easing,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AnimatedReanimated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerCasoProyecto, seleccionarProyectos } from '../data/proyectos';

const GITHUB_USUARIO = 'Kokeeu';
const CORREO = 'andersonsolanochavarria@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/anderson-solano-chavarria-75a5763b8';
const COLOR_MORADO = '#79c6d8';
const FUENTE_TITULOS = Platform.OS === 'web' ? 'Anton' : undefined;
const FUENTE_TEXTO = Platform.OS === 'web' ? 'IBM Plex Mono' : undefined;

const TramaPuntos = ({ style }) => (
  <View pointerEvents="none" style={[estilos.tramaPuntos, style]}>
    {Array.from({ length: 96 }, (_, indice) => (
      <View key={indice} style={[estilos.puntoTrama, indice % 5 === 0 && estilos.puntoTramaGrande]} />
    ))}
  </View>
);

const CodigoBarras = () => (
  <View style={estilos.codigoBarras}>
    {[2, 5, 2, 3, 6, 2, 4, 2, 7, 3, 2, 5, 2, 4, 6, 2].map((ancho, indice) => (
      <View key={indice} style={[estilos.barraCodigo, { width: ancho }]} />
    ))}
  </View>
);

const MarcaRegistro = ({ style }) => (
  <View pointerEvents="none" style={[estilos.marcaRegistro, style]}>
    <View style={estilos.circuloRegistro} />
    <View style={estilos.lineaRegistroHorizontal} />
    <View style={estilos.lineaRegistroVertical} />
    <View style={estilos.puntoRegistro} />
  </View>
);

const MarcasCorte = ({ style }) => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, estilos.marcasCorte, style]}>
    <View style={[estilos.marcaCorteHorizontal, estilos.corteSuperiorIzquierdoH]} />
    <View style={[estilos.marcaCorteVertical, estilos.corteSuperiorIzquierdoV]} />
    <View style={[estilos.marcaCorteHorizontal, estilos.corteSuperiorDerechoH]} />
    <View style={[estilos.marcaCorteVertical, estilos.corteSuperiorDerechoV]} />
    <View style={[estilos.marcaCorteHorizontal, estilos.corteInferiorIzquierdoH]} />
    <View style={[estilos.marcaCorteVertical, estilos.corteInferiorIzquierdoV]} />
    <View style={[estilos.marcaCorteHorizontal, estilos.corteInferiorDerechoH]} />
    <View style={[estilos.marcaCorteVertical, estilos.corteInferiorDerechoV]} />
  </View>
);

const SeparadorLecturaMovil = ({ pagina, texto }) => (
  <View pointerEvents="none" style={estilos.separadorLecturaMovil}>
    <View style={estilos.lineaSeparadorMovil} />
    <View style={estilos.etiquetaSeparadorMovil}>
      <Text style={estilos.textoSeparadorMovil}>{texto}</Text>
      <Text style={estilos.paginaSeparadorMovil}>PÁG. {pagina}</Text>
    </View>
    <View style={estilos.lineaSeparadorMovil} />
  </View>
);

const FondoEditorial = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 34 }, (_, indice) => (
      <View
        key={indice}
        style={[
          estilos.lineaPapel,
          {
            top: `${indice * 3}%`,
            opacity: indice % 4 === 0 ? 0.05 : 0.022,
            transform: [{ rotate: `${indice % 2 === 0 ? -0.25 : 0.2}deg` }],
          },
        ]}
      />
    ))}
    <TramaPuntos style={estilos.tramaFondoSuperior} />
    <TramaPuntos style={estilos.tramaFondoInferior} />
    <MarcaRegistro style={estilos.registroFondoSuperior} />
    <MarcaRegistro style={estilos.registroFondoInferior} />
  </View>
);

const BotonAnimado = ({ children, onPress, style, accessibilityLabel }) => {
  const escala = useRef(new AnimatedNative.Value(1)).current;

  const presionarIn = () => {
    AnimatedNative.spring(escala, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 24,
      bounciness: 2,
    }).start();
  };

  const presionarOut = () => {
    AnimatedNative.spring(escala, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 55,
    }).start();
  };

  return (
    <Pressable
      onPressIn={presionarIn}
      onPressOut={presionarOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <AnimatedNative.View style={[style, { transform: [{ scale: escala }] }]}>
        {children}
      </AnimatedNative.View>
    </Pressable>
  );
};

const VinetaRevelable = ({ children, style, delay = 0, direccion = 'derecha' }) => {
  const reducirMovimiento = useReducedMotion();
  const progreso = useRef(new AnimatedNative.Value(reducirMovimiento ? 1 : 0)).current;
  const referencia = useRef(null);
  const yaRevelada = useRef(false);

  useEffect(() => {
    let observador;

    if (reducirMovimiento) {
      progreso.setValue(1);
      return undefined;
    }

    const revelar = () => {
      if (yaRevelada.current) return;
      yaRevelada.current = true;
      AnimatedNative.sequence([
        AnimatedNative.delay(delay),
        AnimatedNative.timing(progreso, {
          toValue: 1,
          duration: 460,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (
      Platform.OS === 'web'
      && typeof window !== 'undefined'
      && 'IntersectionObserver' in window
      && referencia.current
    ) {
      observador = new window.IntersectionObserver(
        (entradas) => {
          if (entradas.some((entrada) => entrada.isIntersecting)) {
            revelar();
            observador?.disconnect();
          }
        },
        { threshold: 0.16, rootMargin: '0px 0px -6% 0px' }
      );
      observador.observe(referencia.current);
    } else {
      revelar();
    }

    return () => {
      observador?.disconnect();
    };
  }, [delay, progreso, reducirMovimiento]);

  const desplazamientoX = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [direccion === 'izquierda' ? -18 : 18, 0],
  });
  const desplazamientoY = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });
  const rotacion = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [direccion === 'izquierda' ? '-1.2deg' : '1.2deg', '0deg'],
  });

  return (
    <AnimatedNative.View
      ref={referencia}
      style={[
        style,
        {
          opacity: progreso,
          transform: [
            { translateX: desplazamientoX },
            { translateY: desplazamientoY },
            { rotate: rotacion },
          ],
        },
      ]}
    >
      {children}
    </AnimatedNative.View>
  );
};

const TarjetaProyecto = ({ item, index, ancho, destacado, esMovil }) => {
  const router = useRouter();
  const caso = obtenerCasoProyecto(item.name);
  const urlDemo = item.homepage || caso?.demo;
  const tieneDemo = Boolean(urlDemo);
  const anoActualizacion = item.updated_at ? new Date(item.updated_at).getFullYear() : '2026';
  const nombreProyecto = caso?.titulo || item.name.replace(/-/g, ' ');
  const nombreLargo = nombreProyecto.length > 17;
  const tieneCaptura = item.name.toLowerCase() === 'siwo';
  const altoPortadaMovil = [252, 184, 224][index % 3];
  const altoTarjetaMovil = [526, 458, 496][index % 3];
  const desplazamientoHover = useRef(new AnimatedNative.Value(0)).current;

  const animarHover = (activo) => {
    AnimatedNative.timing(desplazamientoHover, {
      toValue: activo ? 1 : 0,
      duration: activo ? 130 : 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const eventosHover = Platform.OS === 'web'
    ? {
        onMouseEnter: () => animarHover(true),
        onMouseLeave: () => animarHover(false),
      }
    : {};

  return (
    <VinetaRevelable
      delay={(index % 3) * 85}
      direccion={index % 2 === 0 ? 'izquierda' : 'derecha'}
      style={[estilos.celdaProyecto, esMovil && estilos.celdaProyectoMovil, { width: ancho }]}
    >
      <MarcasCorte />
      {esMovil && (
        <Text
          pointerEvents="none"
          style={[
            estilos.folioProyectoMovil,
            index % 2 === 1
              ? estilos.folioProyectoMovilDerecho
              : estilos.folioProyectoMovilIzquierdo,
          ]}
        >
          PÁG. {String(index + 2).padStart(2, '0')} / ARCHIVO {String(index + 1).padStart(2, '0')}
        </Text>
      )}
      <AnimatedNative.View
        pointerEvents="none"
        style={[estilos.sombraRegistroProyecto, { opacity: desplazamientoHover }]}
      />
      <AnimatedNative.View
        {...eventosHover}
        style={[
          estilos.envolturaTarjetaProyecto,
          {
            transform: [
              {
                translateX: desplazamientoHover.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -5],
                }),
              },
              {
                translateY: desplazamientoHover.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -5],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            estilos.tarjetaProyecto,
            index % 2 === 1 && estilos.tarjetaProyectoAlterna,
            esMovil && { minHeight: altoTarjetaMovil },
          ]}
        >
        <View style={estilos.cabeceraFichaProyecto}>
          <Text style={estilos.textoFichaProyecto}>ARCHIVO Nº {String(index + 1).padStart(2, '0')}</Text>
          <Text style={estilos.textoFichaProyecto}>ACT. {anoActualizacion}</Text>
        </View>

        <View style={[estilos.interiorProyecto, destacado && estilos.interiorProyectoDestacado]}>
          <View
            style={[
              estilos.contenedorImagenProyecto,
              destacado && estilos.contenedorImagenProyectoDestacado,
              destacado && tieneCaptura && estilos.contenedorImagenProyectoDestacadoSiwo,
              esMovil && { height: altoPortadaMovil },
            ]}
          >
            <View style={[
              estilos.portadaRepositorio,
              index % 3 === 1 && estilos.portadaRepositorioGris,
              index % 3 === 2 && estilos.portadaRepositorioRoja,
              tieneCaptura && estilos.portadaRepositorioConCaptura,
            ]}>
              {tieneCaptura ? (
                <>
                  <View style={estilos.laminaCapturaProyecto}>
                    <Image
                      source={require('../assets/projects/siwo.png')}
                      style={estilos.capturaProyectoCompleta}
                      resizeMode="contain"
                      accessibilityLabel="Captura completa de la interfaz de Siwö"
                    />
                  </View>
                  <View pointerEvents="none" style={estilos.veloCapturaProyecto} />
                  <View style={destacado ? estilos.fichaCapturaProyectoDestacada : estilos.fichaCapturaProyecto}>
                    <Text style={estilos.etiquetaCapturaProyecto}>CAPTURA REAL / PRODUCT UI</Text>
                    <Text style={estilos.nombreCapturaProyecto}>SIWÖ</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={estilos.rutaRepositorio}>GITHUB.COM / KOKEEU /</Text>
                  <Text
                    numberOfLines={3}
                    style={[
                      estilos.nombrePortadaRepositorio,
                      destacado && estilos.nombrePortadaRepositorioDestacada,
                      nombreLargo && estilos.nombrePortadaRepositorioLargo,
                    ]}
                  >
                    {nombreProyecto}
                  </Text>
                  <View style={estilos.metricasPortada}>
                    <View><Text style={estilos.valorMetrica}>{item.open_issues_count || 0}</Text><Text style={estilos.etiquetaMetrica}>ISSUES</Text></View>
                    <View><Text style={estilos.valorMetrica}>{item.stargazers_count || 0}</Text><Text style={estilos.etiquetaMetrica}>STARS</Text></View>
                    <View><Text style={estilos.valorMetrica}>{item.forks_count || 0}</Text><Text style={estilos.etiquetaMetrica}>FORKS</Text></View>
                  </View>
                  <Image
                    source={require('../assets/icon.png')}
                    style={[estilos.retratoPortadaProyecto, destacado && estilos.retratoPortadaProyectoDestacado]}
                    resizeMode="cover"
                    accessibilityLabel="Ilustración editorial del proyecto"
                  />
                  <View style={estilos.lineaEditorialProyecto} />
                </>
              )}
              {destacado && <MarcaRegistro style={estilos.registroPortadaProyecto} />}
            </View>
            <TramaPuntos style={estilos.tramaImagenProyecto} />
            <View style={estilos.numeroProyecto}>
              <Text accessibilityElementsHidden style={estilos.textoNumeroProyectoDesregistro}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <Text style={estilos.textoNumeroProyecto}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
          </View>

          <View style={[estilos.cuerpoTarjetaProyecto, esMovil && estilos.cuerpoTarjetaProyectoMovil]}>
            <View style={estilos.filaMetaProyecto}>
              <View style={estilos.pillLenguaje}>
                <Text style={estilos.textoLenguaje}>{caso?.categoria || item.language || 'PROYECTO'}</Text>
              </View>
              {item.stargazers_count > 0 && (
                <View style={estilos.estrellasRepositorio}>
                  <Ionicons name="star" size={12} color="#111111" />
                  <Text style={estilos.textoEstrellas}>{item.stargazers_count}</Text>
                </View>
              )}
            </View>

            <Text
              numberOfLines={destacado ? 3 : 2}
              style={[
                estilos.tituloTarjeta,
                destacado && estilos.tituloTarjetaDestacada,
                nombreLargo && estilos.tituloTarjetaLarga,
              ]}
            >
              {nombreProyecto}
            </Text>
            <Text style={estilos.descripcionTarjeta} numberOfLines={destacado ? 5 : 3}>
              {caso?.resumen || item.description || 'Una pieza del archivo: decisiones de interfaz, desarrollo y código reunidas en un mismo proyecto.'}
            </Text>

            <View style={estilos.accionesProyecto}>
              <BotonAnimado
                style={[estilos.botonProyecto, estilos.botonProyectoPrincipal]}
                onPress={() => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: item.name } })}
                accessibilityLabel={`Leer caso de estudio de ${nombreProyecto}`}
              >
                <Text style={estilos.textoBotonProyectoPrincipal}>LEER CASO</Text>
                <Ionicons name="arrow-forward" size={14} color="#f5fbfd" />
              </BotonAnimado>
              {tieneDemo && (
                <BotonAnimado
                  style={estilos.botonProyecto}
                  onPress={() => Linking.openURL(urlDemo)}
                  accessibilityLabel={`Ver demo de ${item.name}`}
                >
                  <Text style={estilos.textoBotonProyecto}>DEMO</Text>
                  <MaterialCommunityIcons name="open-in-new" size={14} color="#111111" />
                </BotonAnimado>
              )}
              <BotonAnimado
                style={estilos.botonProyecto}
                onPress={() => Linking.openURL(item.html_url)}
                accessibilityLabel={`Ver código de ${item.name}`}
              >
                <FontAwesome5 name="github" size={14} color="#111111" />
                <Text style={estilos.textoBotonProyecto}>VER CÓDIGO</Text>
              </BotonAnimado>
            </View>
          </View>
        </View>
        </View>
      </AnimatedNative.View>
    </VinetaRevelable>
  );
};

export default function App() {
  const [repositorios, setRepositorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorRepositorios, setErrorRepositorios] = useState(false);
  const opacidadPulso = useRef(new AnimatedNative.Value(0.4)).current;
  const reveladoTitulo = useRef(new AnimatedNative.Value(0)).current;
  const movimientoSello = useRef(new AnimatedNative.Value(0)).current;
  const listaRef = useRef(null);
  const posicionProyectos = useRef(0);
  const { width } = useWindowDimensions();
  const esEscritorio = width >= 900;
  const esMovil = width < 720;
  const reducirMovimiento = useReducedMotion();

  useEffect(() => {
    let componenteActivo = true;

    const obtenerRepositorios = async () => {
      try {
        const respuesta = await fetch(
          `https://api.github.com/users/${GITHUB_USUARIO}/repos?sort=updated&per_page=100`
        );

        if (!respuesta.ok) throw new Error('No se pudieron cargar los repositorios');

        const datos = await respuesta.json();
        if (componenteActivo && Array.isArray(datos)) {
          setRepositorios(
            seleccionarProyectos(datos.filter((repo) => !repo.fork && !repo.archived))
          );
        }
      } catch (error) {
        if (componenteActivo) setErrorRepositorios(true);
        console.error(error);
      } finally {
        if (componenteActivo) setCargando(false);
      }
    };

    obtenerRepositorios();
    return () => {
      componenteActivo = false;
    };
  }, []);

  useEffect(() => {
    const animacionPulso = AnimatedNative.loop(
      AnimatedNative.sequence([
        AnimatedNative.timing(opacidadPulso, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        AnimatedNative.timing(opacidadPulso, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    if (reducirMovimiento) {
      opacidadPulso.setValue(1);
    } else {
      animacionPulso.start();
    }

    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = '#eef7fa';
      document.body.style.margin = '0';

      if (!document.getElementById('portfolio-fonts')) {
        const enlaceFuentes = document.createElement('link');
        enlaceFuentes.id = 'portfolio-fonts';
        enlaceFuentes.rel = 'stylesheet';
        enlaceFuentes.href = 'https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
        document.head.appendChild(enlaceFuentes);
      } else {
        document.getElementById('portfolio-fonts').href = 'https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
      }
    }

    return () => animacionPulso.stop();
  }, [opacidadPulso, reducirMovimiento]);

  useEffect(() => {
    if (reducirMovimiento) {
      reveladoTitulo.setValue(1);
      movimientoSello.setValue(0.5);
      return undefined;
    }

    reveladoTitulo.setValue(0);
    movimientoSello.setValue(0);

    const animacionTitulo = AnimatedNative.sequence([
      AnimatedNative.delay(220),
      AnimatedNative.timing(reveladoTitulo, {
        toValue: 1,
        duration: 720,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const animacionSello = AnimatedNative.loop(
      AnimatedNative.sequence([
        AnimatedNative.timing(movimientoSello, {
          toValue: 1,
          duration: 2300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        AnimatedNative.timing(movimientoSello, {
          toValue: 0,
          duration: 2300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    animacionTitulo.start();
    animacionSello.start();

    return () => {
      animacionTitulo.stop();
      animacionSello.stop();
    };
  }, [movimientoSello, reducirMovimiento, reveladoTitulo]);

  const desplazamientoCortina = reveladoTitulo.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(width, 720)],
  });
  const rotacionSello = movimientoSello.interpolate({
    inputRange: [0, 1],
    outputRange: ['7deg', '11deg'],
  });

  const irAProyectos = () => {
    listaRef.current?.scrollTo({ y: posicionProyectos.current, animated: true });
  };

  const formatoProyecto = (index) => {
    if (width < 720) return { ancho: '100%', destacado: false };
    if (width < 1100) return { ancho: '48.5%', destacado: false };
    if (index === 0 || index === 3) return { ancho: '63.8%', destacado: true };
    if (index === 1 || index === 2) return { ancho: '34%', destacado: false };
    return { ancho: '48.8%', destacado: false };
  };

  const renderizarCabecera = () => (
    <View style={[estilos.cabeceraContenedor, esMovil && estilos.cabeceraContenedorMovil]}>
      <View style={[estilos.barraNavegacion, esMovil && estilos.barraNavegacionMovil]}>
        <View>
          <Text style={estilos.marca}>AS / PORTFOLIO</Text>
          <Text style={estilos.numeroEdicion}>ISSUE 001 · 2026</Text>
        </View>
        {esEscritorio && (
          <View style={estilos.enlacesNavegacion}>
            <Text style={[estilos.enlaceNavegacion, estilos.enlaceNavegacionActivo]}>01 INICIO</Text>
            <Pressable onPress={irAProyectos} accessibilityRole="link">
              <Text style={estilos.enlaceNavegacion}>02 PROYECTOS</Text>
            </Pressable>
          </View>
        )}
        <BotonAnimado
          style={estilos.botonNavegacion}
          onPress={() => Linking.openURL(`mailto:${CORREO}`)}
          accessibilityLabel="Contactar a Anderson"
        >
          <Text style={estilos.textoBotonNavegacion}>CONTACTO ↗</Text>
        </BotonAnimado>
      </View>

      <View style={[estilos.hero, esEscritorio && estilos.heroEscritorio, esMovil && estilos.heroMovil]}>
        <AnimatedReanimated.View
          entering={FadeInDown.duration(700)}
          style={[
            estilos.heroContenido,
            esEscritorio && estilos.heroContenidoEscritorio,
            esMovil && estilos.heroContenidoMovil,
          ]}
        >
          <View style={estilos.filaEditorialSuperior}>
            <Text style={estilos.textoEditorialSuperior}>CREATIVE DEVELOPMENT / COSTA RICA</Text>
            <Text style={estilos.textoEditorialSuperior}>VOL. 01</Text>
          </View>

          <View style={estilos.contenedorEstado}>
            <AnimatedNative.View style={[estilos.puntoEstado, { opacity: opacidadPulso }]} />
            <Text style={estilos.textoEstado}>DISPONIBLE PARA OPORTUNIDADES</Text>
          </View>

          <Text style={estilos.saludo}>ANDERSON SOLANO CHAVARRÍA PRESENTA</Text>
          <View style={estilos.contenedorTituloRevelado}>
            <Text
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[
                estilos.tituloHero,
                esEscritorio && estilos.tituloHeroEscritorio,
                estilos.tituloRegistroDesplazado,
              ]}
            >
              FRONT/{`\n`}END
            </Text>
            <Text
              accessibilityRole="header"
              style={[
                estilos.tituloHero,
                esEscritorio && estilos.tituloHeroEscritorio,
                estilos.tituloHeroPrincipal,
              ]}
            >
              FRONT<Text style={estilos.textoAcento}>/</Text>{`\n`}END
            </Text>
            <AnimatedNative.View
              pointerEvents="none"
              style={[
                estilos.cortinaTinta,
                { transform: [{ translateX: desplazamientoCortina }] },
              ]}
            />
          </View>
          <View style={estilos.subtituloManga}>
            <Text style={estilos.textoIndiceHero}>EDICIÓN / 01</Text>
            <Text style={estilos.textoEspecialidad}>DESARROLLADOR ESPECIALIZADO EN FRONTEND</Text>
          </View>
          <Text style={estilos.descripcionHero}>
            Construyo interfaces web y móviles con una dirección visual fuerte, código claro y atención a cada detalle.
          </Text>

          <View style={estilos.filaAcciones}>
            <BotonAnimado style={estilos.botonPrincipal} onPress={irAProyectos} accessibilityLabel="Ver proyectos">
              <Text style={estilos.textoBotonPrincipal}>LEER PROYECTOS</Text>
              <Ionicons name="arrow-forward" size={17} color="#f5fbfd" />
            </BotonAnimado>
            <BotonAnimado
              style={estilos.botonSecundario}
              onPress={() => Linking.openURL(`mailto:${CORREO}`)}
              accessibilityLabel="Contactarme por correo"
            >
              <Text style={estilos.textoBotonSecundario}>ESCRIBIRME</Text>
            </BotonAnimado>
          </View>

          <View style={estilos.filaSocial}>
            <BotonAnimado
              style={estilos.botonSocial}
              onPress={() => Linking.openURL(`https://github.com/${GITHUB_USUARIO}`)}
              accessibilityLabel="Abrir perfil de GitHub"
            >
              <FontAwesome5 name="github" size={17} color="#111111" />
            </BotonAnimado>
            <BotonAnimado
              style={estilos.botonSocial}
              onPress={() => Linking.openURL(LINKEDIN)}
              accessibilityLabel="Abrir perfil de LinkedIn"
            >
              <FontAwesome5 name="linkedin" size={17} color="#111111" />
            </BotonAnimado>
            <Text style={estilos.textoSocial}>GITHUB / LINKEDIN / CR</Text>
          </View>
        </AnimatedReanimated.View>

        <AnimatedReanimated.View
          entering={FadeIn.delay(250).duration(900)}
          style={[
            estilos.heroVisual,
            esEscritorio && estilos.heroVisualEscritorio,
            esMovil && estilos.heroVisualMovil,
          ]}
        >
          <MarcasCorte style={estilos.marcasCorteHero} />
          <TramaPuntos style={estilos.tramaHero} />
          <View style={estilos.panelRetratoManga}>
            <View style={estilos.cabeceraPanelManga}>
              <Text style={estilos.textoCabeceraPanel}>CAPÍTULO 01</Text>
              <Text style={estilos.textoCabeceraPanel}>RETRATO DEL AUTOR</Text>
            </View>
            <Image
              source={require('../assets/icon.png')}
              style={estilos.imagenRetratoManga}
              resizeMode="cover"
              accessibilityLabel="Ilustración de Anderson Solano"
            />
            <View style={estilos.piePanelManga}>
              <Text style={estilos.textoPiePanelManga}>CREAR TAMBIÉN ES CONTAR UNA HISTORIA.</Text>
            </View>
          </View>
          <View style={estilos.panelRetratoSecundario}>
            <Image
              source={{ uri: `https://github.com/${GITHUB_USUARIO}.png` }}
              style={estilos.fotoPerfilSecundaria}
              accessibilityLabel="Fotografía de Anderson Solano"
            />
            <Text style={estilos.textoPanelSecundario}>AUTOR / DEV</Text>
          </View>
          <AnimatedNative.View style={[estilos.selloDisponible, { transform: [{ rotate: rotacionSello }] }]}>
            <Text style={estilos.textoSelloDisponible}>DISPONIBLE</Text>
            <Text style={estilos.textoSelloNumero}>2026</Text>
          </AnimatedNative.View>
          <Text style={[estilos.textoVerticalHero, esMovil && estilos.textoVerticalHeroMovil]}>DISEÑO / CÓDIGO / HISTORIA</Text>
          <View style={estilos.barrasHero}><CodigoBarras /></View>
          <Text style={estilos.folioHero}>PÁG. 01 / 03 · REG. ICE–79</Text>
        </AnimatedReanimated.View>
      </View>

      <View style={estilos.contenedorHabilidades}>
        <Text style={estilos.textoCintaHabilidades}>REACT NATIVE ◆ JAVASCRIPT ◆ PYTHON ◆ GIT ◆ HTML ◆ CSS ◆ UI SYSTEMS ◆</Text>
      </View>

      <View
        style={[
          estilos.contenedorTituloSeccion,
          esMovil && estilos.contenedorTituloSeccionMovil,
        ]}
        onLayout={(evento) => {
          posicionProyectos.current = evento.nativeEvent.layout.y;
        }}
      >
        <View>
          <Text style={estilos.etiquetaSeccion}>CAPÍTULO 02 / TRABAJO SELECCIONADO</Text>
          <Text style={[estilos.tituloSeccionProyectos, esMovil && estilos.tituloSeccionProyectosMovil]}>ARCHIVO DE PROYECTOS</Text>
        </View>
        <Text style={[estilos.numeroSeccionGrande, esMovil && estilos.numeroSeccionGrandeMovil]}>02</Text>
      </View>
    </View>
  );

  const renderizarListaVacia = () => (
    <View style={estilos.estadoProyectos}>
      {cargando ? (
        <>
          <ActivityIndicator color={COLOR_MORADO} size="small" />
          <Text style={estilos.textoEstadoProyectos}>Cargando proyectos…</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons
            name={errorRepositorios ? 'cloud-alert-outline' : 'folder-open-outline'}
            size={32}
            color={COLOR_MORADO}
          />
          <Text style={estilos.textoEstadoProyectos}>
            {errorRepositorios
              ? 'No fue posible cargar los proyectos en este momento.'
              : 'Pronto habrá nuevos proyectos por aquí.'}
          </Text>
          <BotonAnimado
            style={estilos.botonEstadoProyectos}
            onPress={() => Linking.openURL(`https://github.com/${GITHUB_USUARIO}`)}
            accessibilityLabel="Abrir GitHub"
          >
            <Text style={estilos.textoBotonEstado}>Visitar GitHub</Text>
          </BotonAnimado>
        </>
      )}
    </View>
  );

  const renderizarPie = () => (
    <View style={[estilos.pieContenedor, esMovil && estilos.pieContenedorMovil]}>
      <View style={[estilos.sobreMi, esEscritorio && estilos.sobreMiEscritorio, esMovil && estilos.sobreMiMovil]}>
        <View style={[estilos.columnaNumeroSobreMi, esMovil && estilos.columnaNumeroSobreMiMovil]}>
          <Text style={estilos.numeroSobreMi}>/</Text>
          <Text style={estilos.textoVerticalSobreMi}>FIRMA DEL AUTOR</Text>
        </View>
        <View style={estilos.sobreMiTexto}>
          <Text style={estilos.etiquetaSeccion}>MANIFIESTO / SOBRE MÍ</Text>
          <Text style={estilos.tituloSobreMi}>No diseño para llenar pantallas.</Text>
        </View>
        <View style={estilos.columnaDescripcionSobreMi}>
          <Text style={estilos.descripcionSobreMi}>
            Construyo interfaces que se sienten pensadas, no ensambladas. Me interesa el punto donde diseño y código dejan de sentirse separados: una jerarquía clara, un gesto inesperado y ninguna decisión sin motivo.
          </Text>
          <View style={estilos.fichaAutor}>
            <Text style={estilos.textoFichaAutor}>BASE</Text><Text style={estilos.valorFichaAutor}>COSTA RICA</Text>
            <Text style={estilos.textoFichaAutor}>ENFOQUE</Text><Text style={estilos.valorFichaAutor}>FRONTEND</Text>
            <Text style={estilos.textoFichaAutor}>HERRAMIENTAS</Text><Text style={estilos.valorFichaAutor}>REACT / JS</Text>
          </View>
          <View pointerEvents="none" style={estilos.firmaPersonal}>
            <Text style={estilos.slashFirmaPersonal}>/</Text>
            <Text style={estilos.textoFirmaPersonal}>ANDERSON SOLANO · FRONTEND</Text>
          </View>
        </View>
      </View>

      <View style={[
        estilos.tarjetaContacto,
        esEscritorio && estilos.tarjetaContactoEscritorio,
        esMovil && estilos.tarjetaContactoMovil,
      ]}>
        <Text style={estilos.textoFondoContacto}>CONTACTO</Text>
        <View style={estilos.contactoTexto}>
          <Text style={estilos.etiquetaContacto}>ÚLTIMA PÁGINA / CONTINÚA…</Text>
          <Text style={estilos.tituloContacto}>¿Cuál será la próxima historia?</Text>
          <Text style={estilos.descripcionContacto}>Disponible para colaborar en proyectos web y móviles con una identidad propia.</Text>
        </View>
        <BotonAnimado
          style={estilos.botonContacto}
          onPress={() => Linking.openURL(`mailto:${CORREO}`)}
          accessibilityLabel="Enviar correo a Anderson"
        >
          <Text style={estilos.textoBotonContacto}>INICIAR CONVERSACIÓN</Text>
          <Ionicons name="arrow-forward" size={18} color="#111111" />
        </BotonAnimado>
      </View>

      <View style={estilos.filaCopyright}>
        <Text style={estilos.textoCopyright}>© 2026 Anderson Solano Chavarría</Text>
        <Text style={estilos.textoCopyright}>REG. 001 · CYAN OFFSET +03</Text>
        <Text style={estilos.textoCopyright}>EDICIÓN 001 / HECHO CON REACT NATIVE</Text>
      </View>
    </View>
  );

  return (
    <View style={estilos.cuerpo}>
      <FondoEditorial />
      <ScrollView
        ref={listaRef}
        contentContainerStyle={estilos.contenedorLista}
        showsVerticalScrollIndicator={false}
      >
        {renderizarCabecera()}
        {repositorios.length === 0 ? (
          renderizarListaVacia()
        ) : (
          <View style={[estilos.rejillaProyectos, esMovil && estilos.rejillaProyectosMovil]}>
            {repositorios.map((item, index) => {
              const formato = formatoProyecto(index);
              return (
                <React.Fragment key={item.id}>
                  <TarjetaProyecto
                    item={item}
                    index={index}
                    ancho={formato.ancho}
                    destacado={formato.destacado}
                    esMovil={esMovil}
                  />
                  {esMovil && index === 1 && (
                    <SeparadorLecturaMovil pagina="04" texto="SIGUIENTE CAPÍTULO" />
                  )}
                  {esMovil && index === 3 && (
                    <SeparadorLecturaMovil pagina="06" texto="CONTINÚA…" />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        )}
        {renderizarPie()}
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const estilos = StyleSheet.create({
  cuerpo: { flex: 1, backgroundColor: '#eef7fa' },
  contenedorLista: { paddingBottom: 36 },
  lineaPapel: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#171717' },
  tramaPuntos: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, overflow: 'hidden' },
  puntoTrama: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#111111', opacity: 0.38 },
  puntoTramaGrande: { width: 3, height: 3, opacity: 0.55 },
  tramaFondoSuperior: { position: 'absolute', right: -20, top: 80, width: 130, height: 90, opacity: 0.18, transform: [{ rotate: '-8deg' }] },
  tramaFondoInferior: { position: 'absolute', left: -20, top: 720, width: 150, height: 110, opacity: 0.12, transform: [{ rotate: '7deg' }] },
  marcaRegistro: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', opacity: 0.58 },
  circuloRegistro: { position: 'absolute', width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#111111' },
  lineaRegistroHorizontal: { position: 'absolute', width: 30, height: 1, backgroundColor: '#111111' },
  lineaRegistroVertical: { position: 'absolute', width: 1, height: 30, backgroundColor: '#111111' },
  puntoRegistro: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLOR_MORADO },
  registroFondoSuperior: { position: 'absolute', left: 14, top: 152, opacity: 0.22 },
  registroFondoInferior: { position: 'absolute', right: 16, bottom: 24, opacity: 0.18 },
  marcasCorte: { zIndex: 8 },
  marcaCorteHorizontal: { position: 'absolute', width: 15, height: 1, backgroundColor: '#111111', opacity: 0.72 },
  marcaCorteVertical: { position: 'absolute', width: 1, height: 15, backgroundColor: '#111111', opacity: 0.72 },
  corteSuperiorIzquierdoH: { top: -6, left: -8 },
  corteSuperiorIzquierdoV: { top: -8, left: -6 },
  corteSuperiorDerechoH: { top: -6, right: -8 },
  corteSuperiorDerechoV: { top: -8, right: -6 },
  corteInferiorIzquierdoH: { bottom: -6, left: -8 },
  corteInferiorIzquierdoV: { bottom: -8, left: -6 },
  corteInferiorDerechoH: { right: -8, bottom: -6 },
  corteInferiorDerechoV: { right: -6, bottom: -8 },
  separadorLecturaMovil: { width: '100%', minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 11, marginVertical: 8 },
  lineaSeparadorMovil: { flex: 1, height: 2, backgroundColor: '#111111' },
  etiquetaSeparadorMovil: { minWidth: 136, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 9, backgroundColor: '#111111', transform: [{ rotate: '-1deg' }] },
  textoSeparadorMovil: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
  paginaSeparadorMovil: { color: COLOR_MORADO, fontFamily: FUENTE_TITULOS, fontSize: 19, lineHeight: 22, letterSpacing: 0.5 },
  codigoBarras: { height: 38, flexDirection: 'row', alignItems: 'stretch', gap: 2 },
  barraCodigo: { height: '100%', backgroundColor: '#111111' },
  cabeceraContenedor: { width: '100%', maxWidth: 1220, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  cabeceraContenedorMovil: { paddingHorizontal: 18, paddingTop: 10 },
  barraNavegacion: { minHeight: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottomWidth: 3, borderBottomColor: '#111111' },
  barraNavegacionMovil: { minHeight: 58, paddingBottom: 9 },
  marca: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 25, fontWeight: '900', letterSpacing: 0.5 },
  numeroEdicion: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '700', letterSpacing: 1.5, marginTop: 1 },
  enlacesNavegacion: { flexDirection: 'row', alignItems: 'center', gap: 34 },
  enlaceNavegacion: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  enlaceNavegacionActivo: { textDecorationLine: 'underline' },
  botonNavegacion: { minHeight: 40, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#111111', backgroundColor: '#111111' },
  textoBotonNavegacion: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  hero: { position: 'relative', paddingTop: 34, paddingBottom: 44, alignItems: 'center', gap: 34 },
  heroEscritorio: { minHeight: 650, paddingTop: 42, paddingBottom: 48, flexDirection: 'row', justifyContent: 'space-between', gap: 46 },
  heroMovil: { paddingTop: 24, paddingBottom: 34, gap: 18 },
  heroContenido: { width: '100%', maxWidth: 650, alignItems: 'flex-start' },
  heroContenidoEscritorio: { flex: 1 },
  heroContenidoMovil: { maxWidth: '100%' },
  filaEditorialSuperior: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#111111', marginBottom: 14 },
  textoEditorialSuperior: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '700', letterSpacing: 0.6 },
  contenedorEstado: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5fbfd', paddingHorizontal: 10, paddingVertical: 6, borderWidth: 2, borderColor: '#111111' },
  puntoEstado: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLOR_MORADO, marginRight: 8 },
  textoEstado: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  saludo: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 1.6, marginTop: 18 },
  contenedorTituloRevelado: { width: '100%', position: 'relative', overflow: 'hidden' },
  tituloHero: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 76, lineHeight: 69, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  tituloHeroEscritorio: { fontSize: 126, lineHeight: 108, letterSpacing: -2 },
  tituloHeroPrincipal: { position: 'relative', zIndex: 1 },
  tituloRegistroDesplazado: { position: 'absolute', left: 4, top: 1, color: COLOR_MORADO, opacity: 0.78, zIndex: 0 },
  cortinaTinta: { ...StyleSheet.absoluteFillObject, zIndex: 3, backgroundColor: '#111111', borderLeftWidth: 8, borderLeftColor: COLOR_MORADO },
  textoAcento: { color: COLOR_MORADO },
  subtituloManga: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, paddingVertical: 8, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#111111' },
  textoIndiceHero: { color: '#f5fbfd', backgroundColor: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: 8, paddingVertical: 5 },
  textoEspecialidad: { flex: 1, color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  descripcionHero: { color: '#222222', fontFamily: FUENTE_TEXTO, fontSize: 13, lineHeight: 21, maxWidth: 560, marginTop: 18 },
  filaAcciones: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 30 },
  botonPrincipal: { minHeight: 48, backgroundColor: '#111111', paddingHorizontal: 20, minWidth: 170, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111111' },
  botonSecundario: { minHeight: 48, backgroundColor: 'transparent', paddingHorizontal: 20, minWidth: 142, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111111' },
  textoBotonPrincipal: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  textoBotonSecundario: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  filaSocial: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 30 },
  botonSocial: { width: 36, height: 36, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111111' },
  textoSocial: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '700', marginLeft: 3, letterSpacing: 0.5 },
  heroVisual: { width: '100%', maxWidth: 410, height: 510, alignItems: 'center', justifyContent: 'center' },
  heroVisualEscritorio: { width: 490, maxWidth: 490, height: 570 },
  heroVisualMovil: { height: 478, marginTop: 12 },
  marcasCorteHero: { top: 22, right: 12, bottom: 18, left: 10, opacity: 0.8 },
  tramaHero: { position: 'absolute', right: 0, top: 10, width: 190, height: 150, opacity: 0.65, transform: [{ rotate: '6deg' }] },
  panelRetratoManga: { position: 'absolute', left: 20, top: 42, width: '78%', height: 430, backgroundColor: '#f8fcfd', borderWidth: 4, borderColor: '#111111', transform: [{ rotate: '-1.5deg' }] },
  cabeceraPanelManga: { height: 34, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 9, backgroundColor: '#111111' },
  textoCabeceraPanel: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '800', letterSpacing: 0.5 },
  imagenRetratoManga: { width: '100%', flex: 1, backgroundColor: '#ffffff', filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.45)' : undefined },
  piePanelManga: { minHeight: 46, justifyContent: 'center', paddingHorizontal: 10, borderTopWidth: 3, borderTopColor: '#111111' },
  textoPiePanelManga: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, lineHeight: 12, fontWeight: '900', letterSpacing: 0.3 },
  panelRetratoSecundario: { position: 'absolute', right: 0, bottom: 30, width: 138, padding: 5, backgroundColor: '#f5fbfd', borderWidth: 3, borderColor: '#111111', transform: [{ rotate: '2.5deg' }] },
  fotoPerfilSecundaria: { width: '100%', height: 94, filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.35)' : undefined },
  textoPanelSecundario: { color: '#f5fbfd', backgroundColor: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.7, paddingHorizontal: 6, paddingVertical: 5, marginTop: 4 },
  selloDisponible: { position: 'absolute', right: 7, top: 88, width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_MORADO, borderWidth: 3, borderColor: '#111111', transform: [{ rotate: '9deg' }] },
  textoSelloDisponible: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  textoSelloNumero: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 22, marginTop: 1 },
  textoVerticalHero: { position: 'absolute', right: -105, top: 248, width: 300, color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 18, letterSpacing: 2, transform: [{ rotate: '90deg' }] },
  textoVerticalHeroMovil: { right: -116, top: 232, fontSize: 14, letterSpacing: 1.4 },
  barrasHero: { position: 'absolute', left: 0, bottom: 0, width: 110, height: 38 },
  folioHero: { position: 'absolute', right: 0, bottom: 1, color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
  contenedorHabilidades: { width: '112%', alignSelf: 'center', paddingVertical: 13, paddingHorizontal: 20, backgroundColor: '#111111', borderTopWidth: 3, borderBottomWidth: 3, borderColor: '#111111', transform: [{ rotate: '-1deg' }], overflow: 'hidden' },
  textoCintaHabilidades: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 19, letterSpacing: 1.2, textAlign: 'center' },
  contenedorTituloSeccion: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 78, marginBottom: 22, paddingBottom: 12, borderBottomWidth: 4, borderBottomColor: '#111111' },
  contenedorTituloSeccionMovil: { marginTop: 58, marginBottom: 34, paddingBottom: 10, alignItems: 'flex-start' },
  etiquetaSeccion: { color: COLOR_MORADO, fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  tituloSeccionProyectos: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 38, fontWeight: '900', letterSpacing: 0.3, marginTop: 4 },
  tituloSeccionProyectosMovil: { maxWidth: 250, fontSize: 34, lineHeight: 38 },
  numeroSeccionGrande: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 66, lineHeight: 66 },
  numeroSeccionGrandeMovil: { position: 'absolute', right: 0, bottom: 8, color: COLOR_MORADO, fontSize: 54, lineHeight: 54, opacity: 0.78 },
  rejillaProyectos: { width: '100%', maxWidth: 1220, alignSelf: 'center', paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 20 },
  rejillaProyectosMovil: { paddingHorizontal: 18, gap: 14 },
  celdaProyecto: { minHeight: 430, position: 'relative' },
  celdaProyectoMovil: { marginTop: 18, marginBottom: 18 },
  folioProyectoMovil: { position: 'absolute', top: -19, zIndex: 10, color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  folioProyectoMovilIzquierdo: { left: 1 },
  folioProyectoMovilDerecho: { right: 1, textAlign: 'right' },
  envolturaTarjetaProyecto: { flex: 1 },
  sombraRegistroProyecto: { position: 'absolute', top: 6, right: -6, bottom: -6, left: 6, backgroundColor: COLOR_MORADO, borderWidth: 3, borderColor: '#111111' },
  tarjetaProyecto: { flex: 1, minHeight: 430, backgroundColor: '#f7fbfd', overflow: 'hidden', borderWidth: 3, borderColor: '#111111' },
  tarjetaProyectoAlterna: { backgroundColor: '#dfecef' },
  cabeceraFichaProyecto: { height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: '#111111' },
  textoFichaProyecto: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '800', letterSpacing: 0.7 },
  interiorProyecto: { flex: 1 },
  interiorProyectoDestacado: { flexDirection: 'row' },
  contenedorImagenProyecto: { height: 200, backgroundColor: '#d9e8ed', overflow: 'hidden', borderBottomWidth: 3, borderBottomColor: '#111111' },
  contenedorImagenProyectoDestacado: { width: '55%', height: '100%', borderBottomWidth: 0, borderRightWidth: 3, borderRightColor: '#111111' },
  contenedorImagenProyectoDestacadoSiwo: { width: '62%' },
  portadaRepositorio: { flex: 1, position: 'relative', overflow: 'hidden', padding: 17, backgroundColor: '#f8fcfd' },
  portadaRepositorioConCaptura: { padding: 0, alignItems: 'stretch', justifyContent: 'flex-start', backgroundColor: '#f8fcfd' },
  portadaRepositorioGris: { backgroundColor: '#dce9ed' },
  portadaRepositorioRoja: { backgroundColor: '#d6edf4' },
  laminaCapturaProyecto: { width: '100%', aspectRatio: 1264 / 771, overflow: 'hidden', backgroundColor: '#f8fcfd', borderBottomWidth: 3, borderBottomColor: COLOR_MORADO },
  capturaProyectoCompleta: { width: '100%', height: '100%', filter: Platform.OS === 'web' ? 'saturate(0.9) contrast(1.03)' : undefined },
  veloCapturaProyecto: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent', borderWidth: 6, borderColor: 'rgba(248,252,253,0.7)' },
  fichaCapturaProyecto: { position: 'absolute', left: 12, bottom: 12, minWidth: 154, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: 'rgba(17,17,17,0.92)', borderLeftWidth: 5, borderLeftColor: COLOR_MORADO },
  fichaCapturaProyectoDestacada: { position: 'absolute', left: 18, bottom: 20, width: 176, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#111111', borderLeftWidth: 5, borderLeftColor: COLOR_MORADO },
  etiquetaCapturaProyecto: { color: '#b9cdd4', fontFamily: FUENTE_TEXTO, fontSize: 6, fontWeight: '900', letterSpacing: 0.6 },
  nombreCapturaProyecto: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 22, lineHeight: 25, letterSpacing: 0.5 },
  rutaRepositorio: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  nombrePortadaRepositorio: { maxWidth: '78%', color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 30, lineHeight: 33, textTransform: 'uppercase', marginTop: 13 },
  nombrePortadaRepositorioDestacada: { maxWidth: '84%', fontSize: 46, lineHeight: 49, marginTop: 22 },
  nombrePortadaRepositorioLargo: { fontSize: 25, lineHeight: 28 },
  metricasPortada: { position: 'absolute', left: 17, bottom: 15, flexDirection: 'row', gap: 22 },
  valorMetrica: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 17, lineHeight: 18 },
  etiquetaMetrica: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 6, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 },
  retratoPortadaProyecto: { position: 'absolute', right: -7, bottom: -10, width: 82, height: 82, opacity: 0.9, filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.5)' : undefined },
  retratoPortadaProyectoDestacado: { width: 122, height: 122 },
  lineaEditorialProyecto: { position: 'absolute', right: 29, top: -34, width: 3, height: 150, backgroundColor: '#111111', transform: [{ rotate: '28deg' }] },
  tramaImagenProyecto: { position: 'absolute', right: -8, bottom: -8, width: 82, height: 72, opacity: 0.34 },
  numeroProyecto: { position: 'absolute', top: 10, right: 10, minWidth: 48, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_MORADO, borderWidth: 2, borderColor: '#111111' },
  textoNumeroProyectoDesregistro: { position: 'absolute', color: '#111111', opacity: 0.3, fontFamily: FUENTE_TITULOS, fontSize: 23, transform: [{ translateX: 2 }, { translateY: 1 }] },
  textoNumeroProyecto: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 23 },
  registroPortadaProyecto: { position: 'absolute', right: 62, bottom: 18, opacity: 0.36, transform: [{ scale: 0.72 }] },
  cuerpoTarjetaProyecto: { flex: 1, minWidth: 0, padding: 18 },
  cuerpoTarjetaProyectoMovil: { padding: 16 },
  filaMetaProyecto: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pillLenguaje: { backgroundColor: '#111111', paddingHorizontal: 8, paddingVertical: 5 },
  textoLenguaje: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  estrellasRepositorio: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textoEstrellas: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '800' },
  tituloTarjeta: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 28, lineHeight: 31, textTransform: 'uppercase', marginTop: 16 },
  tituloTarjetaDestacada: { fontSize: 33, lineHeight: 36 },
  tituloTarjetaLarga: { fontSize: 23, lineHeight: 27 },
  descripcionTarjeta: { color: '#202020', fontFamily: FUENTE_TEXTO, fontSize: 11, marginTop: 10, lineHeight: 18 },
  accionesProyecto: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 'auto', paddingTop: 22 },
  botonProyecto: { minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 11, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#111111' },
  botonProyectoPrincipal: { backgroundColor: '#111111', borderColor: '#111111' },
  textoBotonProyecto: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  textoBotonProyectoPrincipal: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  estadoProyectos: { width: '100%', maxWidth: 1172, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', minHeight: 230, padding: 24, marginBottom: 30, borderWidth: 3, borderColor: '#111111', backgroundColor: '#f7fbfd' },
  textoEstadoProyectos: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 11, marginTop: 12, textAlign: 'center' },
  botonEstadoProyectos: { marginTop: 18, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111111' },
  textoBotonEstado: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 10, fontWeight: '800' },
  pieContenedor: { width: '100%', maxWidth: 1220, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 72 },
  pieContenedorMovil: { paddingHorizontal: 18, paddingTop: 56 },
  sobreMi: { gap: 26, paddingVertical: 34, borderTopWidth: 4, borderBottomWidth: 4, borderColor: '#111111' },
  sobreMiEscritorio: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', gap: 34 },
  sobreMiMovil: { gap: 22, paddingTop: 22, paddingBottom: 30 },
  columnaNumeroSobreMi: { width: 98, gap: 10, paddingRight: 16, borderRightWidth: 3, borderRightColor: '#111111' },
  columnaNumeroSobreMiMovil: { width: '100%', minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 0, paddingBottom: 12, borderRightWidth: 0, borderBottomWidth: 2, borderBottomColor: '#111111' },
  numeroSobreMi: { color: COLOR_MORADO, fontFamily: FUENTE_TITULOS, fontSize: 104, lineHeight: 92 },
  textoVerticalSobreMi: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  sobreMiTexto: { flex: 1, maxWidth: 430 },
  tituloSobreMi: { color: '#111111', fontFamily: FUENTE_TITULOS, fontSize: 40, lineHeight: 45, letterSpacing: 0.2, marginTop: 8 },
  columnaDescripcionSobreMi: { flex: 1, maxWidth: 470, gap: 22 },
  descripcionSobreMi: { color: '#202020', fontFamily: FUENTE_TEXTO, fontSize: 12, lineHeight: 20 },
  fichaAutor: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#111111' },
  textoFichaAutor: { width: '42%', color: '#f5fbfd', backgroundColor: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '800', letterSpacing: 0.5, padding: 7, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#111111' },
  valorFichaAutor: { width: '58%', color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', padding: 7, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#111111' },
  firmaPersonal: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 9, paddingTop: 4 },
  slashFirmaPersonal: { color: COLOR_MORADO, fontFamily: FUENTE_TITULOS, fontSize: 28, lineHeight: 30 },
  textoFirmaPersonal: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  tarjetaContacto: { position: 'relative', overflow: 'hidden', padding: 28, backgroundColor: '#111111', borderWidth: 4, borderColor: '#111111', gap: 24, marginTop: 54 },
  tarjetaContactoEscritorio: { minHeight: 250, paddingHorizontal: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 40 },
  tarjetaContactoMovil: { marginTop: 42, padding: 22, gap: 22 },
  textoFondoContacto: { position: 'absolute', left: -8, bottom: -44, color: '#f5fbfd', opacity: 0.055, fontFamily: FUENTE_TITULOS, fontSize: 118, letterSpacing: -2 },
  contactoTexto: { maxWidth: 650 },
  etiquetaContacto: { color: '#8ed7e8', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  tituloContacto: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 42, lineHeight: 48, letterSpacing: 0.2, marginTop: 8 },
  descripcionContacto: { color: '#b9cdd4', fontFamily: FUENTE_TEXTO, fontSize: 11, lineHeight: 19, marginTop: 8 },
  botonContacto: { minHeight: 52, paddingHorizontal: 20, backgroundColor: '#f5fbfd', borderWidth: 3, borderColor: '#f5fbfd', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  textoBotonContacto: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  filaCopyright: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, paddingVertical: 30 },
  textoCopyright: { color: '#111111', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '800', letterSpacing: 0.4 },
});

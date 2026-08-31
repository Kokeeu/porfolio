import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import Reanimated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  obtenerCasoProyecto,
  PROYECTOS_DESTACADOS,
  seleccionarProyectos,
} from '../data/proyectos';

const GITHUB_USUARIO = 'Kokeeu';
const CORREO = 'andersonsolanochavarria@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/anderson-solano-chavarria-75a5763b8';
const AZUL = '#2028f7';
const AZUL_OSCURO = '#09107f';
const HIELO = '#f7f5ed';
const LILA = '#c9c6ff';
const ROJO = '#ff4136';
const NEGRO = '#09090b';
const GRIS = '#676978';
const DISPLAY = Platform.OS === 'web' ? 'Anton' : undefined;
const MONO = Platform.OS === 'web' ? 'IBM Plex Mono' : undefined;
const MANO = Platform.OS === 'web' ? 'Caveat' : undefined;

const repositoriosBase = PROYECTOS_DESTACADOS.map((nombre, indice) => {
  const caso = obtenerCasoProyecto(nombre);
  return {
    id: `local-${nombre}`,
    name: nombre,
    html_url: `https://github.com/${GITHUB_USUARIO}/${nombre}`,
    homepage: caso?.demo,
    language: caso?.stack?.[0] || 'JavaScript',
    stargazers_count: 0,
    updated_at: '2026-01-01T00:00:00Z',
    ordenLocal: indice,
  };
});

const Trama = ({ style, clara = false, roja = false }) => (
  <View pointerEvents="none" style={[styles.trama, style]}>
    {Array.from({ length: 126 }, (_, indice) => (
      <View
        key={indice}
        style={[
          styles.punto,
          { backgroundColor: clara ? HIELO : roja ? ROJO : AZUL, opacity: indice % 8 === 0 ? 0.85 : 0.28 },
        ]}
      />
    ))}
  </View>
);

const Estrella = ({ style, clara = false, pequena = false }) => (
  <Text pointerEvents="none" style={[styles.estrella, clara && styles.estrellaClara, pequena && styles.estrellaPequena, style]}>✦</Text>
);

const Etiqueta = ({ children, azul = false, roja = false, style }) => (
  <View style={[styles.etiqueta, azul && styles.etiquetaAzul, roja && styles.etiquetaRoja, style]}>
    <Text style={[styles.etiquetaTexto, (azul || roja) && styles.etiquetaTextoClaro]}>{children}</Text>
  </View>
);

const BarraVentana = ({ titulo, clara = false }) => (
  <View style={[styles.barraVentana, clara && styles.barraVentanaClara]}>
    <Text style={[styles.barraVentanaTitulo, clara && styles.barraVentanaTituloOscuro]}>{titulo}</Text>
    <View style={styles.controlesVentana}>
      <Text style={[styles.controlVentana, clara && styles.controlVentanaOscuro]}>—</Text>
      <Text style={[styles.controlVentana, clara && styles.controlVentanaOscuro]}>□</Text>
      <Text style={[styles.controlVentana, clara && styles.controlVentanaOscuro]}>×</Text>
    </View>
  </View>
);

const Boton = ({ children, onPress, claro = false, azul = false, icono, label }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.boton, claro && styles.botonClaro, azul && styles.botonAzul, pressed && styles.botonPresionado]}>
        <Text style={[styles.botonTexto, azul && styles.botonTextoClaro]}>{children}</Text>
        {icono}
      </View>
    )}
  </Pressable>
);

const DecoracionFondo = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={styles.lineaFondoA} />
    <View style={styles.lineaFondoB} />
    <Trama style={styles.tramaFondoA} />
    <Trama style={styles.tramaFondoB} />
    <Text style={styles.fondoCruz}>＋</Text>
  </View>
);

const HeroCollage = ({ movil }) => (
  <View style={[styles.collage, movil && styles.collageMovil]}>
    <View style={styles.collageFondoNegro} />
    <View style={styles.collageFondoLila} />
    <View style={styles.collageAroA} />
    <View style={styles.collageAroB} />
    <Trama clara style={styles.collageTrama} />
    <View style={styles.collageVentana}>
      <BarraVentana titulo="PROFILE.JPG" />
      <Image
        source={require('../assets/icon.png')}
        style={styles.collageRetrato}
        resizeMode="cover"
        accessibilityLabel="Ilustración de Anderson Solano"
      />
      <View style={styles.collageVentanaPie}>
        <Text style={styles.collageVentanaPieTexto}>100% / RGB / CR</Text>
        <Text style={styles.collageVentanaPieTexto}>READY</Text>
      </View>
    </View>
    <View style={styles.collageRecorte}>
      <Image source={require('../assets/icon.png')} style={styles.collageRecorteImagen} resizeMode="cover" accessibilityElementsHidden />
    </View>
    <View style={styles.collageCursor}>
      <Ionicons name="navigate" size={30} color={NEGRO} />
      <Text style={styles.collageCursorTexto}>ANDERSON.EXE</Text>
    </View>
    <View style={styles.collageNota}>
      <Text style={styles.collageNotaTexto}>frontend con obsesión{`\n`}por los detalles ↗</Text>
    </View>
    <View style={styles.collageArchivo}>
      <Text style={styles.collageArchivoNumero}>01</Text>
      <Text style={styles.collageArchivoTexto}>PERSONAL{`\n`}FILE</Text>
    </View>
    <Estrella clara style={styles.collageEstrellaA} />
    <Estrella clara pequena style={styles.collageEstrellaB} />
    <Text style={styles.collageTextoVertical}>WEB / MOBILE / VISUAL DIRECTION / 2026</Text>
  </View>
);

const AccionesProyecto = ({ item, caso, oscuro = false }) => {
  const router = useRouter();
  const demo = item.homepage || caso?.demo;
  const tintaCodigo = oscuro ? HIELO : NEGRO;

  return (
    <View style={styles.accionesProyecto}>
      <Boton
        azul
        label={`Leer caso de ${caso.titulo}`}
        onPress={() => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: item.name } })}
        icono={<Ionicons name="arrow-forward" size={14} color={HIELO} />}
      >
        LEER EL CASO
      </Boton>
      {demo ? (
        <Boton
          claro={oscuro}
          label={`Abrir demo de ${caso.titulo}`}
          onPress={() => Linking.openURL(demo)}
          icono={<MaterialCommunityIcons name="open-in-new" size={14} color={NEGRO} />}
        >
          DEMO
        </Boton>
      ) : null}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Ver código de ${caso.titulo}`}
        onPress={() => Linking.openURL(item.html_url)}
        style={[styles.githubProyecto, oscuro && styles.githubProyectoOscuro]}
      >
        <FontAwesome5 name="github" size={15} color={tintaCodigo} />
      </Pressable>
    </View>
  );
};

const ProyectoSiwo = ({ item, caso, movil }) => (
  <Reanimated.View entering={FadeInDown.duration(600)} style={[styles.escena, styles.escenaSiwo, movil && styles.escenaMovil]}>
    <Text style={styles.numeroFondoSiwo}>01</Text>
    <View style={[styles.siwoTexto, movil && styles.textoProyectoMovil]}>
      <Etiqueta roja>OPENINGS / ENDINGS</Etiqueta>
      <Text style={[styles.tituloProyecto, movil && styles.tituloProyectoMovil]}>SIWÖ</Text>
      <Text style={styles.bajadaProyecto}>EL OPENING QUE TIENES EN LA CABEZA, PERO NO RECUERDAS CÓMO SE LLAMA.</Text>
      <Text style={styles.descripcionProyecto}>{caso.resumen}</Text>
      <View style={styles.miniDatos}>
        {caso.resultados.map((dato) => <Text key={dato} style={styles.miniDato}>{dato}</Text>)}
      </View>
      <AccionesProyecto item={item} caso={caso} />
    </View>
    <View style={[styles.siwoVisual, movil && styles.siwoVisualMovil]}>
      <View style={styles.siwoSombra} />
      <View style={styles.siwoCapturaMarco}>
        <BarraVentana clara titulo="SIWO_HOME.PNG" />
        <Image source={require('../assets/projects/siwo.png')} style={styles.siwoCaptura} resizeMode="contain" accessibilityLabel="Captura real de Siwö" />
      </View>
      <View style={styles.siwoSticker}><Text style={styles.siwoStickerTexto}>623{`\n`}SERIES</Text></View>
      <Text style={styles.siwoAnotacion}>hecho para encontrar{`\n`}esa canción ↓</Text>
    </View>
  </Reanimated.View>
);

const ProyectoCodeCut = ({ item, caso, movil }) => (
  <Reanimated.View entering={FadeInDown.duration(600)} style={[styles.escena, styles.escenaCodecut, movil && styles.escenaMovil]}>
    <Trama clara style={styles.codecutTrama} />
    <View style={[styles.codecutVisual, movil && styles.codecutVisualMovil]}>
      <Text style={[styles.codecutRatio, movil && styles.codecutRatioMovil]}>9:16</Text>
      <View style={styles.timelineVentana}>
        <BarraVentana titulo="TIMELINE_V04.CUT" />
        <View style={styles.timelineRegla}>
          {['00', '05', '10', '15', '20'].map((valor) => <Text key={valor} style={styles.timelineReglaTexto}>{valor}</Text>)}
        </View>
        {[0, 1, 2, 3].map((fila) => (
          <View key={fila} style={styles.timelineFila}>
            <Text style={styles.timelineFilaNumero}>0{fila + 1}</Text>
            <View style={[styles.timelineClip, fila % 2 === 1 && styles.timelineClipLila, { width: `${34 + fila * 11}%` }]} />
            <View style={styles.timelineClipNegro} />
          </View>
        ))}
        <View style={styles.timelineCursor} />
      </View>
      <View style={styles.codecutPlay}><Ionicons name="play" size={28} color={NEGRO} /></View>
      <Text style={styles.codecutNota}>corta / mueve / exporta</Text>
    </View>
    <View style={[styles.codecutTexto, movil && styles.textoProyectoMovil]}>
      <Etiqueta azul>VIDEO / FULL-STACK</Etiqueta>
      <Text style={[styles.tituloProyectoClaro, movil && styles.tituloProyectoMovil]}>CODECUT</Text>
      <Text style={styles.bajadaProyectoClara}>UN EDITOR VERTICAL DONDE LA TIMELINE MANDA.</Text>
      <Text style={styles.descripcionProyectoClara}>{caso.resumen}</Text>
      <View style={styles.codecutStack}>
        {caso.stack.map((tecnologia) => <Text key={tecnologia} style={styles.codecutStackTexto}>{tecnologia}</Text>)}
      </View>
      <AccionesProyecto item={item} caso={caso} oscuro />
    </View>
  </Reanimated.View>
);

const ProyectoPortfolio = ({ item, caso, movil }) => (
  <Reanimated.View entering={FadeInDown.duration(600)} style={[styles.escena, styles.escenaPortfolio, movil && styles.escenaMovil]}>
    <View style={styles.portfolioPalabraFondo}>
      <Text style={[styles.portfolioPalabra, movil && styles.portfolioPalabraMovil]}>THIS{`\n`}SITE{`\n`}IS THE{`\n`}PROJECT</Text>
    </View>
    <View style={[styles.portfolioTexto, movil && styles.portfolioTextoMovil]}>
      <Etiqueta roja>PORTFOLIO / FRONTEND</Etiqueta>
      <Text style={styles.portfolioNumero}>03 / 04</Text>
      <Text style={[styles.tituloProyectoClaro, movil && styles.tituloProyectoMovil]}>{caso.titulo}</Text>
      <Text style={styles.descripcionProyectoClara}>{caso.resumen}</Text>
      <AccionesProyecto item={item} caso={caso} oscuro />
    </View>
    <View style={[styles.portfolioCollage, movil && styles.portfolioCollageMovil]}>
      <View style={styles.portfolioRetratoGrande}>
        <Image source={require('../assets/icon.png')} style={styles.portfolioRetratoImagen} resizeMode="cover" accessibilityLabel="Ilustración personal utilizada en el portfolio" />
      </View>
      <View style={styles.portfolioPopup}>
        <BarraVentana clara titulo="ABOUT_ME.TXT" />
        <Text style={styles.portfolioPopupTexto}>NO ES UNA GALERÍA DE REPOS.{`\n`}{`\n`}ES UNA FORMA DE MOSTRAR CÓMO PIENSO.</Text>
        <View style={styles.portfolioPopupBoton}><Text style={styles.portfolioPopupBotonTexto}>OK</Text></View>
      </View>
      <Estrella clara style={styles.portfolioEstrella} />
      <Trama clara style={styles.portfolioTrama} />
    </View>
  </Reanimated.View>
);

const ProyectoCorreos = ({ item, caso, movil }) => (
  <Reanimated.View entering={FadeInDown.duration(600)} style={[styles.escena, styles.escenaCorreos, movil && styles.escenaMovil]}>
    <View style={[styles.correosTexto, movil && styles.textoProyectoMovil]}>
      <Etiqueta azul>DATOS / FULL-STACK</Etiqueta>
      <Text style={[styles.tituloProyecto, styles.tituloCorreos, movil && styles.tituloProyectoMovil]}>BUSCADOR{`\n`}DE CORREOS</Text>
      <Text style={styles.descripcionProyecto}>{caso.resumen}</Text>
      <View style={styles.miniDatos}>
        {caso.resultados.map((dato) => <Text key={dato} style={styles.miniDato}>{dato}</Text>)}
      </View>
      <AccionesProyecto item={item} caso={caso} />
    </View>
    <View style={[styles.correosVisual, movil && styles.correosVisualMovil]}>
      <Text style={styles.correosCsv}>CSV</Text>
      <View style={styles.correoA}><Ionicons name="mail-outline" size={40} color={HIELO} /></View>
      <View style={styles.correoB}><Ionicons name="business-outline" size={34} color={NEGRO} /></View>
      <View style={styles.correoC}><Ionicons name="location-outline" size={38} color={NEGRO} /></View>
      <View style={styles.correoLineaA} />
      <View style={styles.correoLineaB} />
      <View style={styles.correoLineaC} />
      <View style={styles.correosVentana}>
        <BarraVentana titulo="SEARCH.LOG" />
        <Text style={styles.correosVentanaTexto}>[01] SEARCHING BUSINESSES...{`\n`}[02] SCRAPING PUBLIC SITES...{`\n`}[03] FILTERING EMAILS...{`\n`}[04] EXPORT READY ✓</Text>
      </View>
      <Text style={styles.correosNota}>cinco workers,{`\n`}cero pantallas congeladas</Text>
    </View>
  </Reanimated.View>
);

const Proyecto = ({ item, indice, movil }) => {
  const caso = obtenerCasoProyecto(item.name);
  if (!caso) return null;
  if (indice === 0) return <ProyectoSiwo item={item} caso={caso} movil={movil} />;
  if (indice === 1) return <ProyectoCodeCut item={item} caso={caso} movil={movil} />;
  if (indice === 2) return <ProyectoPortfolio item={item} caso={caso} movil={movil} />;
  return <ProyectoCorreos item={item} caso={caso} movil={movil} />;
};

const InterludioPersonal = ({ escritorio, movil }) => (
  <View style={[styles.sobreMi, styles.sobreMiEnLista, !escritorio && styles.sobreMiColumna]}>
    <View style={styles.sobreMiVisual}>
      <Text style={styles.sobreMiPalabra}>PERSO{`\n`}NAL</Text>
      <View style={styles.sobreMiRetratoMarco}>
        <Image source={require('../assets/icon.png')} style={styles.sobreMiRetrato} resizeMode="cover" accessibilityLabel="Ilustración de Anderson" />
      </View>
      <Trama clara style={styles.sobreMiTrama} />
      <Estrella clara style={styles.sobreMiEstrella} />
      <View style={styles.sobreMiSticker}><Text style={styles.sobreMiStickerTexto}>DEV{`\n`}WITH{`\n`}TASTE</Text></View>
    </View>
    <View style={[styles.sobreMiContenido, movil && styles.sobreMiContenidoMovil]}>
      <Text style={styles.sobreMiKicker}>PAUSA ENTRE PROYECTOS / SIN BIO CORPORATIVA</Text>
      <Text style={[styles.sobreMiTitulo, movil && styles.sobreMiTituloMovil]}>NO ME INTERESA QUE TODO PAREZCA UNA LANDING.</Text>
      <Text style={styles.sobreMiTexto}>Me gusta construir interfaces que tengan una idea detrás: una jerarquía clara, una rareza memorable y código capaz de sostener ambas cosas. Mi trabajo vive entre el frontend y la dirección visual.</Text>
      <View style={styles.manifiestoLista}>
        {['CLARIDAD ANTES QUE DECORACIÓN', 'MOVIMIENTO QUE EXPLICA', 'DETALLES QUE SE SIENTEN HUMANOS'].map((texto, indice) => (
          <View key={texto} style={styles.manifiestoItem}>
            <Text style={styles.manifiestoNumero}>0{indice + 1}</Text>
            <Text style={styles.manifiestoTexto}>{texto}</Text>
            <Text style={styles.manifiestoFlecha}>↗</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default function App() {
  const [repositorios, setRepositorios] = useState(repositoriosBase);
  const [cargando, setCargando] = useState(true);
  const scrollRef = useRef(null);
  const posicionProyectos = useRef(0);
  const { width } = useWindowDimensions();
  const movil = width < 720;
  const escritorio = width >= 980;

  useEffect(() => {
    let activo = true;
    fetch(`https://api.github.com/users/${GITHUB_USUARIO}/repos?sort=updated&per_page=100`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('GitHub no disponible');
        return respuesta.json();
      })
      .then((datos) => {
        const seleccion = seleccionarProyectos(datos.filter((repo) => !repo.fork && !repo.archived));
        if (activo && seleccion.length) {
          const remotos = new Map(seleccion.map((repo) => [repo.name.toLowerCase(), repo]));
          setRepositorios(repositoriosBase.map((repo) => remotos.get(repo.name.toLowerCase()) || repo));
        }
      })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.body.style.margin = '0';
    document.body.style.backgroundColor = HIELO;
    let enlace = document.getElementById('portfolio-fonts');
    if (!enlace) {
      enlace = document.createElement('link');
      enlace.id = 'portfolio-fonts';
      enlace.rel = 'stylesheet';
      document.head.appendChild(enlace);
    }
    enlace.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
  }, []);

  const irAProyectos = () => scrollRef.current?.scrollTo({ y: posicionProyectos.current, animated: true });

  return (
    <View style={styles.pagina}>
      <StatusBar style="dark" />
      <DecoracionFondo />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.cabeceraWrap, movil && styles.paddingMovil]}>
          <View style={styles.nav}>
            <View>
              <Text style={styles.logo}>AS<Text style={styles.logoSlash}>//</Text></Text>
              <Text style={styles.logoSub}>ANDERSON SOLANO</Text>
            </View>
            {!movil && (
              <View style={styles.navLinks}>
                <Pressable onPress={irAProyectos}><Text style={styles.navLink}>TRABAJO</Text></Pressable>
                <Pressable onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}><Text style={styles.navLink}>SOBRE MÍ</Text></Pressable>
              </View>
            )}
            <Pressable onPress={() => Linking.openURL(`mailto:${CORREO}`)} style={styles.navContacto} accessibilityLabel="Escribir a Anderson">
              <Text style={styles.navContactoTexto}>CONTACTO ↗</Text>
            </Pressable>
          </View>

          <View style={[styles.hero, !escritorio && styles.heroColumna]}>
            <Reanimated.View entering={FadeIn.duration(550)} style={styles.heroTexto}>
              <View style={styles.heroMeta}>
                <Text style={styles.heroMetaTexto}>ESPECIALIZADO EN FRONTEND</Text>
                <Text style={styles.heroMetaTexto}>COSTA RICA / 2026</Text>
              </View>
              <View style={styles.heroTituloWrap}>
                <Text style={[styles.heroTituloSombra, movil && styles.heroTituloMovil]}>HAGO WEBS</Text>
                <Text style={[styles.heroTitulo, movil && styles.heroTituloMovil]}>HAGO WEBS</Text>
                <Text style={[styles.heroTituloAzul, movil && styles.heroTituloMovil]}>CON ALGO</Text>
                <Text style={[styles.heroTitulo, movil && styles.heroTituloMovil]}>QUE DECIR.</Text>
                <View style={styles.heroTituloSticker}><Text style={styles.heroTituloStickerTexto}>Y2K{`\n`}FRONTEND</Text></View>
              </View>
              <View style={styles.heroIntro}>
                <Text style={styles.heroIntroTexto}>Desarrollo interfaces web y móviles con código claro, decisiones visuales fuertes y suficiente personalidad para que nadie las confunda con una plantilla.</Text>
                <Text style={styles.heroIntroNota}>sin relleno{`\n`}sin “se ve bonito y ya”</Text>
              </View>
              <View style={styles.heroAcciones}>
                <Boton azul onPress={irAProyectos} label="Ver proyectos" icono={<Ionicons name="arrow-down" size={14} color={HIELO} />}>VER LO QUE HAGO</Boton>
                <Boton onPress={() => Linking.openURL(`mailto:${CORREO}`)} label="Escribir a Anderson">ESCRIBIRME</Boton>
              </View>
              <View style={styles.heroNumeros}>
                <View style={styles.heroNumero}><Text style={styles.heroNumeroValor}>04</Text><Text style={styles.heroNumeroTexto}>PROYECTOS{`\n`}SELECCIONADOS</Text></View>
                <View style={styles.heroNumero}><Text style={styles.heroNumeroValor}>UI</Text><Text style={styles.heroNumeroTexto}>DISEÑO +{`\n`}DESARROLLO</Text></View>
                <View style={styles.heroNumero}><Text style={styles.heroNumeroValor}>CR</Text><Text style={styles.heroNumeroTexto}>DISPONIBLE{`\n`}PARA TRABAJAR</Text></View>
              </View>
            </Reanimated.View>
            <Reanimated.View entering={FadeInDown.delay(120).duration(650)} style={styles.heroCollageWrap}>
              <HeroCollage movil={!escritorio} />
            </Reanimated.View>
          </View>
        </View>

        <View style={styles.marquesina}>
          <Text style={styles.marquesinaTexto}>REACT  ✦  REACT NATIVE  ✦  JAVASCRIPT  ✦  EXPO  ✦  INTERFACES CON CARÁCTER  ✦  NO TEMPLATES  ✦  REACT  ✦  REACT NATIVE  ✦  JAVASCRIPT</Text>
        </View>

        <View
          style={[styles.proyectos, movil && styles.paddingMovil]}
          onLayout={(evento) => { posicionProyectos.current = evento.nativeEvent.layout.y; }}
        >
          <View style={[styles.proyectosCabecera, movil && styles.proyectosCabeceraMovil]}>
            <View>
              <Text style={styles.seccionSobrelinea}>COSAS QUE HICE Y POR QUÉ IMPORTAN</Text>
              <Text style={[styles.seccionTitulo, movil && styles.seccionTituloMovil]}>NO SOLO{`\n`}REPOS.</Text>
            </View>
            <View style={styles.proyectosNota}>
              <Text style={styles.proyectosNotaTexto}>cada proyecto tiene{`\n`}una lógica, una pelea{`\n`}y una decisión visual.</Text>
              <Text style={styles.proyectosNotaFlecha}>↓</Text>
            </View>
          </View>

          <View style={styles.listaProyectos}>
            {repositorios.slice(0, 2).map((item, indice) => <Proyecto key={item.id || item.name} item={item} indice={indice} movil={!escritorio} />)}
            <InterludioPersonal escritorio={escritorio} movil={movil} />
            <View style={styles.interrupcionEditorial}>
              <Text style={styles.interrupcionEditorialGrande}>DOS MÁS.</Text>
              <Text style={styles.interrupcionEditorialNota}>mismo desarrollador,{`\n`}otra lógica visual ↓</Text>
              <Estrella style={styles.interrupcionEditorialEstrella} />
            </View>
            {repositorios.slice(2).map((item, indice) => <Proyecto key={item.id || item.name} item={item} indice={indice + 2} movil={!escritorio} />)}
          </View>
          {cargando && <ActivityIndicator color={AZUL} size="small" style={styles.cargando} />}
        </View>

        <View style={[styles.contacto, movil && styles.contactoMovil]}>
          <Trama clara style={styles.contactoTrama} />
          <Text style={styles.contactoMicro}>OPEN FOR WORK / AND STRANGE IDEAS</Text>
          <Text style={[styles.contactoTitulo, movil && styles.contactoTituloMovil]}>¿TIENES UNA{`\n`}IDEA RARA?</Text>
          <Text style={styles.contactoNota}>mejor todavía.</Text>
          <View style={[styles.contactoBotones, movil && styles.contactoBotonesMovil]}>
            <Boton claro onPress={() => Linking.openURL(`mailto:${CORREO}`)} label="Enviar correo" icono={<Ionicons name="arrow-forward" size={15} color={NEGRO} />}>HABLEMOS</Boton>
            <Text style={styles.contactoCorreo}>{CORREO}</Text>
          </View>
          <Estrella clara style={styles.contactoEstrella} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>© 2026 / ANDERSON SOLANO / COSTA RICA</Text>
          <View style={styles.footerLinks}>
            <Pressable onPress={() => Linking.openURL(`https://github.com/${GITHUB_USUARIO}`)}><Text style={styles.footerLink}>GITHUB ↗</Text></Pressable>
            <Pressable onPress={() => Linking.openURL(LINKEDIN)}><Text style={styles.footerLink}>LINKEDIN ↗</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: HIELO },
  scroll: { minHeight: '100%' },
  cabeceraWrap: { width: '100%', maxWidth: 1380, alignSelf: 'center', paddingHorizontal: 34 },
  paddingMovil: { paddingHorizontal: 17 },
  lineaFondoA: { position: 'absolute', top: 104, left: 0, right: 0, height: 1, backgroundColor: 'rgba(32,40,247,0.16)' },
  lineaFondoB: { position: 'absolute', top: 520, left: 0, right: 0, height: 1, backgroundColor: 'rgba(32,40,247,0.08)' },
  trama: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, overflow: 'hidden' },
  punto: { width: 3, height: 3, borderRadius: 2 },
  tramaFondoA: { position: 'absolute', right: -14, top: 128, width: 128, height: 90, transform: [{ rotate: '-9deg' }] },
  tramaFondoB: { position: 'absolute', left: -22, top: 680, width: 100, height: 70 },
  fondoCruz: { position: 'absolute', top: 156, left: 13, color: AZUL, fontFamily: MONO, fontSize: 27 },
  estrella: { color: AZUL, fontSize: 38, lineHeight: 40 },
  estrellaClara: { color: HIELO },
  estrellaPequena: { fontSize: 22, lineHeight: 24 },
  nav: { minHeight: 102, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: NEGRO },
  logo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 31, lineHeight: 31 },
  logoSlash: { color: AZUL },
  logoSub: { color: GRIS, fontFamily: MONO, fontSize: 6, fontWeight: '700', letterSpacing: 1.2, marginTop: 4 },
  navLinks: { flexDirection: 'row', gap: 34 },
  navLink: { color: NEGRO, fontFamily: MONO, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  navContacto: { paddingHorizontal: 17, paddingVertical: 12, backgroundColor: NEGRO, borderBottomWidth: 5, borderBottomColor: AZUL },
  navContactoTexto: { color: HIELO, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  hero: { minHeight: 760, flexDirection: 'row', alignItems: 'center', gap: 42, paddingVertical: 58 },
  heroColumna: { minHeight: 0, flexDirection: 'column', alignItems: 'stretch', paddingVertical: 44 },
  heroTexto: { flex: 1.02, minWidth: 0 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: NEGRO },
  heroMetaTexto: { color: NEGRO, fontFamily: MONO, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  heroTituloWrap: { position: 'relative', marginTop: 22 },
  heroTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 95, lineHeight: 91, letterSpacing: -1.2 },
  heroTituloSombra: { position: 'absolute', left: 6, top: 5, color: ROJO, fontFamily: DISPLAY, fontSize: 95, lineHeight: 91, letterSpacing: -1.2, opacity: 0.85 },
  heroTituloAzul: { color: AZUL, fontFamily: DISPLAY, fontSize: 95, lineHeight: 91, letterSpacing: -1.2 },
  heroTituloMovil: { fontSize: 56, lineHeight: 55, letterSpacing: -0.4 },
  heroTituloSticker: { position: 'absolute', right: 4, top: '34%', width: 78, height: 78, alignItems: 'center', justifyContent: 'center', borderRadius: 42, backgroundColor: LILA, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '12deg' }] },
  heroTituloStickerTexto: { color: NEGRO, fontFamily: DISPLAY, fontSize: 19, lineHeight: 18, textAlign: 'center' },
  heroIntro: { position: 'relative', maxWidth: 570, paddingLeft: 17, marginTop: 28, borderLeftWidth: 7, borderLeftColor: AZUL },
  heroIntroTexto: { maxWidth: 430, color: '#292a30', fontFamily: MONO, fontSize: 11, lineHeight: 19 },
  heroIntroNota: { position: 'absolute', right: 0, bottom: -15, color: AZUL, fontFamily: MANO, fontSize: 18, lineHeight: 18, textAlign: 'center', transform: [{ rotate: '-5deg' }] },
  heroAcciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 30 },
  boton: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 15, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: NEGRO },
  botonClaro: { backgroundColor: HIELO, borderColor: HIELO, borderBottomWidth: 5, borderBottomColor: LILA },
  botonAzul: { backgroundColor: AZUL, borderColor: AZUL, borderBottomWidth: 5, borderBottomColor: AZUL_OSCURO },
  botonPresionado: { opacity: 0.78, transform: [{ translateY: 2 }] },
  botonTexto: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 0.6 },
  botonTextoClaro: { color: HIELO },
  heroNumeros: { flexDirection: 'row', marginTop: 36, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: NEGRO },
  heroNumero: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: NEGRO },
  heroNumeroValor: { color: NEGRO, fontFamily: DISPLAY, fontSize: 25 },
  heroNumeroTexto: { color: GRIS, fontFamily: MONO, fontSize: 5.5, fontWeight: '700', lineHeight: 9 },
  heroCollageWrap: { flex: 0.93, minWidth: 0, alignItems: 'center' },
  collage: { position: 'relative', width: '100%', maxWidth: 520, aspectRatio: 0.88, overflow: 'hidden', backgroundColor: AZUL, borderWidth: 2, borderColor: NEGRO, borderBottomWidth: 9, borderBottomColor: NEGRO },
  collageMovil: { maxWidth: 570, alignSelf: 'center' },
  collageFondoNegro: { position: 'absolute', width: '74%', height: '62%', left: -55, bottom: -15, backgroundColor: NEGRO, transform: [{ rotate: '-9deg' }] },
  collageFondoLila: { position: 'absolute', width: '54%', height: '48%', right: -38, top: 32, backgroundColor: LILA, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '8deg' }] },
  collageAroA: { position: 'absolute', width: '90%', height: '45%', left: '4%', top: '28%', borderWidth: 2, borderColor: HIELO, borderRadius: 200, transform: [{ rotate: '-19deg' }] },
  collageAroB: { position: 'absolute', width: 120, height: 120, left: 19, top: 77, borderWidth: 2, borderColor: HIELO, borderRadius: 70 },
  collageTrama: { position: 'absolute', width: 170, height: 130, right: -11, bottom: 40 },
  collageVentana: { position: 'absolute', width: '60%', aspectRatio: 0.84, right: 24, top: '13%', overflow: 'hidden', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '4deg' }] },
  barraVentana: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, backgroundColor: NEGRO },
  barraVentanaClara: { backgroundColor: HIELO, borderBottomWidth: 1.5, borderBottomColor: NEGRO },
  barraVentanaTitulo: { color: HIELO, fontFamily: MONO, fontSize: 6, fontWeight: '700', letterSpacing: 0.7 },
  barraVentanaTituloOscuro: { color: NEGRO },
  controlesVentana: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlVentana: { color: HIELO, fontFamily: MONO, fontSize: 10, fontWeight: '700' },
  controlVentanaOscuro: { color: NEGRO },
  collageRetrato: { width: '100%', flex: 1, filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.35)' : undefined },
  collageVentanaPie: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, borderTopWidth: 1.5, borderTopColor: NEGRO },
  collageVentanaPieTexto: { color: NEGRO, fontFamily: MONO, fontSize: 5.5, fontWeight: '700' },
  collageRecorte: { position: 'absolute', left: 23, bottom: 32, width: 155, height: 170, overflow: 'hidden', backgroundColor: NEGRO, borderWidth: 3, borderColor: HIELO, borderRadius: 90, transform: [{ rotate: '-8deg' }] },
  collageRecorteImagen: { width: 205, height: 205, marginLeft: -27, marginTop: -12, filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.65)' : undefined },
  collageCursor: { position: 'absolute', left: 17, top: 20, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-3deg' }] },
  collageCursorTexto: { color: NEGRO, fontFamily: MONO, fontSize: 6, fontWeight: '700' },
  collageNota: { position: 'absolute', right: 10, bottom: 9, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: ROJO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-3deg' }] },
  collageNotaTexto: { color: HIELO, fontFamily: MANO, fontSize: 17, lineHeight: 16, textAlign: 'center' },
  collageArchivo: { position: 'absolute', left: 12, top: '35%', width: 75, height: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: LILA, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '8deg' }] },
  collageArchivoNumero: { color: NEGRO, fontFamily: DISPLAY, fontSize: 30, lineHeight: 31 },
  collageArchivoTexto: { color: NEGRO, fontFamily: MONO, fontSize: 5, fontWeight: '700', textAlign: 'center' },
  collageEstrellaA: { position: 'absolute', left: '43%', top: '51%' },
  collageEstrellaB: { position: 'absolute', right: 14, top: 55 },
  collageTextoVertical: { position: 'absolute', right: -69, top: '47%', width: 175, color: HIELO, fontFamily: MONO, fontSize: 6, fontWeight: '700', letterSpacing: 0.8, transform: [{ rotate: '90deg' }] },
  marquesina: { width: '105%', alignSelf: 'center', overflow: 'hidden', paddingVertical: 14, backgroundColor: AZUL, borderTopWidth: 2, borderBottomWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-1.2deg' }] },
  marquesinaTexto: { color: HIELO, fontFamily: MONO, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center' },
  proyectos: { width: '100%', maxWidth: 1380, alignSelf: 'center', paddingHorizontal: 34, paddingTop: 105, paddingBottom: 115 },
  proyectosCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, paddingBottom: 20, borderBottomWidth: 3, borderBottomColor: NEGRO },
  proyectosCabeceraMovil: { alignItems: 'flex-start', gap: 14 },
  seccionSobrelinea: { color: AZUL, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  seccionTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 78, lineHeight: 74, marginTop: 8 },
  seccionTituloMovil: { fontSize: 49, lineHeight: 48 },
  proyectosNota: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, transform: [{ rotate: '-4deg' }] },
  proyectosNotaTexto: { color: AZUL, fontFamily: MANO, fontSize: 20, lineHeight: 19, textAlign: 'right' },
  proyectosNotaFlecha: { color: AZUL, fontFamily: MANO, fontSize: 33 },
  listaProyectos: { gap: 72 },
  interrupcionEditorial: { position: 'relative', minHeight: 210, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 35, backgroundColor: HIELO, borderTopWidth: 3, borderBottomWidth: 3, borderColor: NEGRO, transform: [{ rotate: '1deg' }] },
  interrupcionEditorialGrande: { color: NEGRO, fontFamily: DISPLAY, fontSize: 92, lineHeight: 96 },
  interrupcionEditorialNota: { position: 'absolute', right: 38, bottom: 38, color: AZUL, fontFamily: MANO, fontSize: 23, lineHeight: 21, textAlign: 'right', transform: [{ rotate: '-5deg' }] },
  interrupcionEditorialEstrella: { position: 'absolute', right: '35%', top: 26 },
  cargando: { marginTop: 24 },
  escena: { position: 'relative', minHeight: 600, overflow: 'hidden', borderWidth: 2, borderColor: NEGRO },
  escenaMovil: { minHeight: 0, flexDirection: 'column' },
  escenaSiwo: { flexDirection: 'row', backgroundColor: HIELO },
  numeroFondoSiwo: { position: 'absolute', left: -18, bottom: -68, color: '#ddd9c9', fontFamily: DISPLAY, fontSize: 260, lineHeight: 270 },
  siwoTexto: { zIndex: 2, width: '39%', justifyContent: 'center', padding: 38 },
  textoProyectoMovil: { width: '100%', padding: 24 },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, backgroundColor: HIELO, borderWidth: 1.5, borderColor: NEGRO },
  etiquetaAzul: { backgroundColor: AZUL, borderColor: AZUL },
  etiquetaRoja: { backgroundColor: ROJO, borderColor: ROJO },
  etiquetaTexto: { color: NEGRO, fontFamily: MONO, fontSize: 7, fontWeight: '700', letterSpacing: 0.7 },
  etiquetaTextoClaro: { color: HIELO },
  tituloProyecto: { color: NEGRO, fontFamily: DISPLAY, fontSize: 67, lineHeight: 70, marginTop: 20 },
  tituloProyectoClaro: { color: HIELO, fontFamily: DISPLAY, fontSize: 67, lineHeight: 70, textTransform: 'uppercase', marginTop: 20 },
  tituloProyectoMovil: { fontSize: 47, lineHeight: 50 },
  tituloCorreos: { fontSize: 57, lineHeight: 59 },
  bajadaProyecto: { color: NEGRO, fontFamily: MONO, fontSize: 10, fontWeight: '700', lineHeight: 16, marginTop: 12 },
  bajadaProyectoClara: { color: HIELO, fontFamily: MONO, fontSize: 10, fontWeight: '700', lineHeight: 16, marginTop: 12 },
  descripcionProyecto: { color: '#303039', fontFamily: MONO, fontSize: 10, lineHeight: 17, marginTop: 15 },
  descripcionProyectoClara: { color: '#d9dcff', fontFamily: MONO, fontSize: 10, lineHeight: 17, marginTop: 15 },
  miniDatos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 19 },
  miniDato: { color: NEGRO, fontFamily: MONO, fontSize: 6.5, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 5, backgroundColor: LILA, borderWidth: 1, borderColor: NEGRO },
  accionesProyecto: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 24 },
  githubProyecto: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: NEGRO },
  githubProyectoOscuro: { borderColor: HIELO },
  siwoVisual: { position: 'relative', flex: 1, minWidth: 0, justifyContent: 'center', padding: 34, backgroundColor: LILA, borderLeftWidth: 2, borderLeftColor: NEGRO },
  siwoVisualMovil: { minHeight: 390, borderLeftWidth: 0, borderTopWidth: 2, borderTopColor: NEGRO },
  siwoSombra: { position: 'absolute', left: 48, top: 58, right: 20, bottom: 49, backgroundColor: AZUL, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '3deg' }] },
  siwoCapturaMarco: { width: '94%', alignSelf: 'center', aspectRatio: 1264 / 820, overflow: 'hidden', backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-2deg' }] },
  siwoCaptura: { width: '100%', flex: 1 },
  siwoSticker: { position: 'absolute', right: 25, bottom: 24, width: 92, height: 92, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: ROJO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '9deg' }] },
  siwoStickerTexto: { color: HIELO, fontFamily: DISPLAY, fontSize: 23, lineHeight: 22, textAlign: 'center' },
  siwoAnotacion: { position: 'absolute', left: 20, bottom: 18, color: NEGRO, fontFamily: MANO, fontSize: 20, lineHeight: 19, transform: [{ rotate: '-6deg' }] },
  escenaCodecut: { flexDirection: 'row', backgroundColor: NEGRO },
  codecutTrama: { position: 'absolute', width: 220, height: 170, right: -10, top: 20 },
  codecutVisual: { position: 'relative', width: '59%', minHeight: 600, overflow: 'hidden', backgroundColor: AZUL, borderRightWidth: 2, borderRightColor: HIELO },
  codecutVisualMovil: { width: '100%', minHeight: 420, borderRightWidth: 0, borderBottomWidth: 2, borderBottomColor: HIELO },
  codecutRatio: { position: 'absolute', left: -8, bottom: -46, color: LILA, fontFamily: DISPLAY, fontSize: 220, lineHeight: 230 },
  codecutRatioMovil: { fontSize: 145, lineHeight: 160 },
  timelineVentana: { position: 'absolute', left: '9%', right: '8%', top: '16%', paddingBottom: 13, backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-3deg' }] },
  timelineRegla: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: NEGRO },
  timelineReglaTexto: { color: GRIS, fontFamily: MONO, fontSize: 6, fontWeight: '700' },
  timelineFila: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, marginHorizontal: 9, marginTop: 8, borderWidth: 1, borderColor: NEGRO },
  timelineFilaNumero: { width: 18, color: NEGRO, fontFamily: MONO, fontSize: 6, fontWeight: '700' },
  timelineClip: { height: 22, backgroundColor: AZUL },
  timelineClipLila: { backgroundColor: LILA },
  timelineClipNegro: { flex: 1, height: 22, backgroundColor: NEGRO },
  timelineCursor: { position: 'absolute', left: '58%', top: 29, bottom: 10, width: 2, backgroundColor: ROJO },
  codecutPlay: { position: 'absolute', right: 28, bottom: 24, width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO },
  codecutNota: { position: 'absolute', left: 20, top: 25, color: HIELO, fontFamily: MANO, fontSize: 22, transform: [{ rotate: '-6deg' }] },
  codecutTexto: { flex: 1, justifyContent: 'center', padding: 38, backgroundColor: NEGRO },
  codecutStack: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 20 },
  codecutStackTexto: { color: HIELO, fontFamily: MONO, fontSize: 6.5, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: LILA },
  escenaPortfolio: { flexDirection: 'row', minHeight: 640, backgroundColor: AZUL },
  portfolioPalabraFondo: { position: 'absolute', left: -8, top: -16 },
  portfolioPalabra: { color: '#0d169f', fontFamily: DISPLAY, fontSize: 120, lineHeight: 101 },
  portfolioPalabraMovil: { fontSize: 76, lineHeight: 67 },
  portfolioTexto: { zIndex: 3, width: '38%', alignSelf: 'flex-end', padding: 38, backgroundColor: 'rgba(9,9,11,0.92)', borderTopWidth: 2, borderRightWidth: 2, borderColor: HIELO },
  portfolioTextoMovil: { width: '100%', alignSelf: 'stretch', padding: 24, borderRightWidth: 0, borderBottomWidth: 2, borderBottomColor: HIELO },
  portfolioNumero: { color: LILA, fontFamily: MONO, fontSize: 8, fontWeight: '700', marginTop: 17 },
  portfolioCollage: { position: 'relative', flex: 1, minWidth: 0 },
  portfolioCollageMovil: { minHeight: 460 },
  portfolioRetratoGrande: { position: 'absolute', width: '61%', aspectRatio: 0.8, right: '8%', bottom: -20, overflow: 'hidden', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '4deg' }] },
  portfolioRetratoImagen: { width: '100%', height: '100%', filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.35)' : undefined },
  portfolioPopup: { position: 'absolute', width: 240, left: '3%', top: '16%', paddingBottom: 14, backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-5deg' }] },
  portfolioPopupTexto: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700', lineHeight: 14, padding: 15 },
  portfolioPopupBoton: { alignSelf: 'flex-end', marginRight: 14, paddingHorizontal: 18, paddingVertical: 6, backgroundColor: AZUL, borderWidth: 1, borderColor: NEGRO },
  portfolioPopupBotonTexto: { color: HIELO, fontFamily: MONO, fontSize: 7, fontWeight: '700' },
  portfolioEstrella: { position: 'absolute', right: 13, top: 21 },
  portfolioTrama: { position: 'absolute', width: 170, height: 120, left: 25, bottom: 18 },
  escenaCorreos: { flexDirection: 'row', backgroundColor: HIELO },
  correosTexto: { width: '42%', justifyContent: 'center', padding: 38 },
  correosVisual: { position: 'relative', flex: 1, minWidth: 0, minHeight: 600, overflow: 'hidden', backgroundColor: LILA, borderLeftWidth: 2, borderLeftColor: NEGRO },
  correosVisualMovil: { minHeight: 430, borderLeftWidth: 0, borderTopWidth: 2, borderTopColor: NEGRO },
  correosCsv: { position: 'absolute', right: -9, bottom: -40, color: '#aba6f2', fontFamily: DISPLAY, fontSize: 210, lineHeight: 220 },
  correoA: { position: 'absolute', left: '14%', top: '18%', width: 96, height: 96, alignItems: 'center', justifyContent: 'center', borderRadius: 52, backgroundColor: AZUL, borderWidth: 3, borderColor: NEGRO },
  correoB: { position: 'absolute', right: '15%', top: '13%', width: 84, height: 84, alignItems: 'center', justifyContent: 'center', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '8deg' }] },
  correoC: { position: 'absolute', right: '9%', bottom: '18%', width: 92, height: 92, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: ROJO, borderWidth: 3, borderColor: NEGRO },
  correoLineaA: { position: 'absolute', left: '27%', top: '28%', width: '49%', height: 2, backgroundColor: NEGRO, transform: [{ rotate: '-8deg' }] },
  correoLineaB: { position: 'absolute', left: '27%', top: '33%', width: '55%', height: 2, backgroundColor: NEGRO, transform: [{ rotate: '31deg' }] },
  correoLineaC: { position: 'absolute', right: '16%', top: '29%', width: 2, height: '49%', backgroundColor: NEGRO, transform: [{ rotate: '-9deg' }] },
  correosVentana: { position: 'absolute', left: '13%', right: '17%', top: '43%', paddingBottom: 13, backgroundColor: NEGRO, borderWidth: 3, borderColor: HIELO, transform: [{ rotate: '-2deg' }] },
  correosVentanaTexto: { color: '#bcc4ff', fontFamily: MONO, fontSize: 8, lineHeight: 18, padding: 14 },
  correosNota: { position: 'absolute', left: 19, bottom: 17, color: AZUL, fontFamily: MANO, fontSize: 20, lineHeight: 19, transform: [{ rotate: '-5deg' }] },
  sobreMi: { width: '100%', maxWidth: 1380, alignSelf: 'center', flexDirection: 'row', minHeight: 600, borderTopWidth: 3, borderBottomWidth: 3, borderColor: NEGRO },
  sobreMiColumna: { flexDirection: 'column' },
  sobreMiEnLista: { transform: [{ rotate: '-0.7deg' }] },
  sobreMiVisual: { position: 'relative', flex: 0.9, minHeight: 530, overflow: 'hidden', backgroundColor: NEGRO, borderRightWidth: 3, borderRightColor: NEGRO },
  sobreMiPalabra: { position: 'absolute', left: -8, top: -15, color: '#17171d', fontFamily: DISPLAY, fontSize: 137, lineHeight: 122 },
  sobreMiRetratoMarco: { position: 'absolute', width: 290, height: 360, left: '16%', bottom: -18, overflow: 'hidden', backgroundColor: HIELO, borderWidth: 3, borderColor: HIELO, transform: [{ rotate: '-5deg' }] },
  sobreMiRetrato: { width: '100%', height: '100%', filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.45)' : undefined },
  sobreMiTrama: { position: 'absolute', width: 190, height: 135, right: -12, top: 22 },
  sobreMiEstrella: { position: 'absolute', right: 30, bottom: 30 },
  sobreMiSticker: { position: 'absolute', left: 23, top: 28, width: 87, height: 87, alignItems: 'center', justifyContent: 'center', borderRadius: 47, backgroundColor: ROJO, borderWidth: 2, borderColor: HIELO, transform: [{ rotate: '9deg' }] },
  sobreMiStickerTexto: { color: HIELO, fontFamily: DISPLAY, fontSize: 18, lineHeight: 17, textAlign: 'center' },
  sobreMiContenido: { flex: 1.1, justifyContent: 'center', padding: 48, backgroundColor: LILA },
  sobreMiContenidoMovil: { padding: 25 },
  sobreMiKicker: { color: AZUL, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 0.9 },
  sobreMiTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 56, lineHeight: 58, marginTop: 13 },
  sobreMiTituloMovil: { fontSize: 40, lineHeight: 42 },
  sobreMiTexto: { color: '#303039', fontFamily: MONO, fontSize: 11, lineHeight: 19, marginTop: 20 },
  manifiestoLista: { marginTop: 25, borderBottomWidth: 1.5, borderBottomColor: NEGRO },
  manifiestoItem: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, borderTopWidth: 1.5, borderTopColor: NEGRO },
  manifiestoNumero: { color: AZUL, fontFamily: DISPLAY, fontSize: 22 },
  manifiestoTexto: { flex: 1, color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 0.4 },
  manifiestoFlecha: { color: NEGRO, fontFamily: MONO, fontSize: 17 },
  contacto: { position: 'relative', width: '100%', maxWidth: 1380, minHeight: 390, alignSelf: 'center', justifyContent: 'center', padding: 55, overflow: 'hidden', backgroundColor: AZUL, borderBottomWidth: 3, borderBottomColor: NEGRO },
  contactoMovil: { minHeight: 430, padding: 25 },
  contactoTrama: { position: 'absolute', right: -10, top: -15, width: 300, height: 205 },
  contactoMicro: { color: '#bdc4ff', fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  contactoTitulo: { color: HIELO, fontFamily: DISPLAY, fontSize: 87, lineHeight: 84, marginTop: 10 },
  contactoTituloMovil: { fontSize: 53, lineHeight: 52 },
  contactoNota: { position: 'absolute', left: '57%', top: '45%', color: HIELO, fontFamily: MANO, fontSize: 26, transform: [{ rotate: '-7deg' }] },
  contactoBotones: { position: 'absolute', right: 55, bottom: 48, alignItems: 'flex-end', gap: 11 },
  contactoBotonesMovil: { position: 'relative', right: 0, bottom: 0, alignSelf: 'flex-start', alignItems: 'flex-start', marginTop: 65 },
  contactoCorreo: { color: HIELO, fontFamily: MONO, fontSize: 7, fontWeight: '700' },
  contactoEstrella: { position: 'absolute', right: 55, top: 45 },
  footer: { width: '100%', maxWidth: 1380, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, paddingHorizontal: 34, paddingVertical: 29 },
  footerTexto: { color: GRIS, fontFamily: MONO, fontSize: 7, fontWeight: '700', letterSpacing: 0.5 },
  footerLinks: { flexDirection: 'row', gap: 18 },
  footerLink: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700' },
});

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerCasoProyecto, obtenerSiguienteProyecto } from '../../data/proyectos';

const GITHUB_USUARIO = 'Kokeeu';
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

const Trama = ({ style, clara = false }) => (
  <View pointerEvents="none" style={[styles.trama, style]}>
    {Array.from({ length: 126 }, (_, indice) => (
      <View key={indice} style={[styles.punto, { backgroundColor: clara ? HIELO : AZUL, opacity: indice % 8 === 0 ? 0.82 : 0.26 }]} />
    ))}
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

const Etiqueta = ({ children, azul = false, roja = false }) => (
  <View style={[styles.etiqueta, azul && styles.etiquetaAzul, roja && styles.etiquetaRoja]}>
    <Text style={[styles.etiquetaTexto, (azul || roja) && styles.etiquetaTextoClaro]}>{children}</Text>
  </View>
);

const Boton = ({ children, onPress, azul = false, icono, label }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
    {({ pressed }) => (
      <View style={[styles.boton, azul && styles.botonAzul, pressed && styles.botonPresionado]}>
        <Text style={[styles.botonTexto, azul && styles.botonTextoClaro]}>{children}</Text>
        {icono}
      </View>
    )}
  </Pressable>
);

const VisualCaso = ({ nombre, movil }) => {
  const id = nombre.toLowerCase();

  if (id === 'siwo') {
    return (
      <View style={styles.visualSiwo}>
        <View style={styles.visualSiwoSombra} />
        <View style={styles.visualSiwoVentana}>
          <BarraVentana clara titulo="SIWO_HOME.PNG" />
          <Image source={require('../../assets/projects/siwo.png')} style={styles.visualSiwoImagen} resizeMode="contain" accessibilityLabel="Captura del proyecto Siwö" />
        </View>
        <View style={styles.visualSiwoSello}><Text style={styles.visualSiwoSelloTexto}>623{`\n`}SERIES</Text></View>
        <Text style={styles.visualNota}>el opening está aquí ↗</Text>
      </View>
    );
  }

  if (id === 'codecut') {
    return (
      <View style={styles.visualCodecut}>
        <Text style={[styles.visualCodecutRatio, movil && styles.visualCodecutRatioMovil]}>9:16</Text>
        <View style={styles.timeline}>
          <BarraVentana titulo="TIMELINE_V04.CUT" />
          {[0, 1, 2, 3].map((fila) => (
            <View key={fila} style={styles.timelineFila}>
              <Text style={styles.timelineNumero}>0{fila + 1}</Text>
              <View style={[styles.timelineClip, fila % 2 === 1 && styles.timelineClipLila, { width: `${30 + fila * 12}%` }]} />
              <View style={styles.timelineClipNegro} />
            </View>
          ))}
          <View style={styles.timelineCursor} />
        </View>
        <View style={styles.visualPlay}><Ionicons name="play" size={27} color={NEGRO} /></View>
      </View>
    );
  }

  if (id === 'portfolio') {
    return (
      <View style={styles.visualPortfolio}>
        <Text style={[styles.visualPortfolioTexto, movil && styles.visualPortfolioTextoMovil]}>THIS{`\n`}SITE{`\n`}IS THE{`\n`}PROJECT</Text>
        <View style={styles.visualPortfolioRetrato}>
          <Image source={require('../../assets/icon.png')} style={styles.visualPortfolioImagen} resizeMode="cover" accessibilityLabel="Ilustración del portfolio" />
        </View>
        <View style={styles.visualPortfolioPopup}>
          <BarraVentana clara titulo="README.TXT" />
          <Text style={styles.visualPortfolioPopupTexto}>YOU ARE{`\n`}LOOKING AT IT.</Text>
        </View>
        <Trama clara style={styles.visualPortfolioTrama} />
      </View>
    );
  }

  return (
    <View style={styles.visualCorreos}>
      <Text style={styles.visualCorreosCsv}>CSV</Text>
      <View style={styles.correoNodoA}><Ionicons name="business-outline" size={34} color={NEGRO} /></View>
      <View style={styles.correoNodoB}><Ionicons name="mail-outline" size={38} color={HIELO} /></View>
      <View style={styles.correoNodoC}><Ionicons name="location-outline" size={36} color={NEGRO} /></View>
      <View style={styles.correoLineaA} />
      <View style={styles.correoLineaB} />
      <View style={styles.correoTerminal}>
        <BarraVentana titulo="SEARCH.LOG" />
        <Text style={styles.correoTerminalTexto}>SEARCHING...{`\n`}SCRAPING...{`\n`}FILTERING...{`\n`}EXPORT READY ✓</Text>
      </View>
    </View>
  );
};

export default function Proyecto() {
  const parametros = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const nombre = Array.isArray(parametros.nombre) ? parametros.nombre[0] : parametros.nombre || '';
  const caso = obtenerCasoProyecto(nombre);
  const siguiente = obtenerSiguienteProyecto(nombre);
  const [repositorio, setRepositorio] = useState(null);
  const movil = width < 720;
  const escritorio = width >= 980;

  useEffect(() => {
    if (!nombre) return;
    let activo = true;
    fetch(`https://api.github.com/repos/${GITHUB_USUARIO}/${encodeURIComponent(nombre)}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Repositorio no disponible');
        return respuesta.json();
      })
      .then((datos) => { if (activo) setRepositorio(datos); })
      .catch(() => {});
    return () => { activo = false; };
  }, [nombre]);

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

  if (!caso) {
    return (
      <View style={styles.noEncontrado}>
        <Text style={styles.noEncontradoNumero}>404</Text>
        <Text style={styles.noEncontradoTexto}>ESTE PROYECTO NO ESTÁ AQUÍ.</Text>
        <Boton azul onPress={() => router.replace('/')} label="Volver al portfolio">VOLVER</Boton>
      </View>
    );
  }

  const urlCodigo = repositorio?.html_url || `https://github.com/${GITHUB_USUARIO}/${caso.repo}`;
  const urlDemo = repositorio?.homepage || caso.demo;

  return (
    <View style={styles.pagina}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.cabecera, movil && styles.paddingMovil]}>
          <View style={styles.nav}>
            <Pressable onPress={() => router.push('/')} style={styles.navVolver} accessibilityLabel="Volver al portfolio">
              <Ionicons name="arrow-back" size={15} color={NEGRO} />
              <Text style={styles.navLogo}>AS<Text style={styles.navSlash}>//</Text></Text>
            </Pressable>
            {!movil && <Text style={styles.navRuta}>PORTFOLIO / {caso.repo.toUpperCase()} / CASE.HTML</Text>}
            <View style={styles.navVivo}><Text style={styles.navVivoTexto}>● ONLINE</Text></View>
          </View>

          <Reanimated.View entering={FadeIn.duration(550)} style={[styles.hero, !escritorio && styles.heroColumna]}>
            <View style={styles.heroTexto}>
              <View style={styles.heroEtiquetas}>
                <Etiqueta azul>{caso.categoria}</Etiqueta>
                <Etiqueta roja>CASO / 0{caso.repo.length % 9 || 1}</Etiqueta>
              </View>
              <Text style={[styles.heroTituloSombra, movil && styles.heroTituloMovil]}>{caso.titulo}</Text>
              <Text style={[styles.heroTitulo, movil && styles.heroTituloMovil]}>{caso.titulo}</Text>
              <Text style={styles.heroResumen}>{caso.resumen}</Text>
              <View style={styles.heroAcciones}>
                {urlDemo ? <Boton azul onPress={() => Linking.openURL(urlDemo)} label={`Abrir demo de ${caso.titulo}`} icono={<MaterialCommunityIcons name="open-in-new" size={14} color={HIELO} />}>ABRIR DEMO</Boton> : null}
                <Boton onPress={() => Linking.openURL(urlCodigo)} label={`Ver código de ${caso.titulo}`} icono={<FontAwesome5 name="github" size={14} color={NEGRO} />}>VER CÓDIGO</Boton>
              </View>
              <View style={styles.heroMetrica}>
                <Text style={styles.heroMetricaValor}>{caso.metrica}</Text>
                <Text style={styles.heroMetricaTexto}>{caso.etiquetaMetrica}</Text>
                <Text style={styles.heroMetricaNota}>la cifra que{`\n`}resume el proyecto ↓</Text>
              </View>
            </View>
            <Reanimated.View entering={FadeInDown.delay(120).duration(650)} style={styles.heroVisualWrap}>
              <View style={styles.heroVisualSombra} />
              <View style={styles.heroVisual}>
                <VisualCaso nombre={nombre} movil={movil} />
              </View>
            </Reanimated.View>
          </Reanimated.View>
        </View>

        <View style={styles.marquesina}>
          <Text style={styles.marquesinaTexto}>{caso.stack.map((tecnologia) => tecnologia.toUpperCase()).join('  ✦  ')}  ✦  {caso.titulo.toUpperCase()}  ✦  {caso.stack.map((tecnologia) => tecnologia.toUpperCase()).join('  ✦  ')}</Text>
        </View>

        <View style={[styles.historia, movil && styles.historiaMovil]}>
          <Text style={[styles.historiaNumeroGigante, movil && styles.historiaNumeroGiganteMovil]}>01</Text>
          <View style={[styles.problemaPapel, !escritorio && styles.problemaPapelMovil]}>
            <Text style={styles.historiaKicker}>ANTES / LA FRICCIÓN</Text>
            <Text style={[styles.historiaTitulo, movil && styles.historiaTituloMovil]}>EL PROBLEMA NO ERA SOLO TÉCNICO.</Text>
            <Text style={styles.historiaTexto}>{caso.problema}</Text>
            <Text style={styles.anotacionProblema}>aquí empezó todo ↘</Text>
          </View>
          <View style={[styles.solucionVentana, !escritorio && styles.solucionVentanaMovil]}>
            <BarraVentana titulo="DECISION_FINAL.TXT" />
            <View style={styles.solucionContenido}>
              <Text style={styles.solucionKicker}>DESPUÉS / LA RESPUESTA</Text>
              <Text style={[styles.solucionTitulo, movil && styles.solucionTituloMovil]}>UNA DECISIÓN DE SISTEMA.</Text>
              <Text style={styles.solucionTexto}>{caso.solucion}</Text>
            </View>
          </View>
          <Trama style={styles.historiaTrama} />
          <Text style={styles.historiaEstrella}>✦</Text>
        </View>

        <View style={[styles.notaAutor, movil && styles.notaAutorMovil]}>
          <View style={styles.notaAvatar}>
            <Image source={require('../../assets/icon.png')} style={styles.notaAvatarImagen} resizeMode="cover" accessibilityLabel="Avatar de Anderson" />
          </View>
          <View style={styles.notaBurbuja}>
            <BarraVentana clara titulo="MESSAGE_FROM_ANDERSON" />
            <Text style={[styles.notaTexto, movil && styles.notaTextoMovil]}>“{caso.notaAutor}”</Text>
            <Text style={styles.notaHora}>12:07 AM / READ ✓</Text>
          </View>
          <Text style={styles.notaManuscrita}>la parte que no sale{`\n`}en el README</Text>
        </View>

        <View style={[styles.decisiones, movil && styles.paddingMovil]}>
          <View style={styles.decisionesCabecera}>
            <Text style={styles.decisionesKicker}>LAS DECISIONES / EN ORDEN DE APARICIÓN</Text>
            <Text style={[styles.decisionesTitulo, movil && styles.decisionesTituloMovil]}>NO FUE{`\n`}POR CASUALIDAD.</Text>
          </View>
          <View style={styles.decisionesLista}>
            {caso.decisiones.map((decision, indice) => (
              <Reanimated.View
                entering={FadeInDown.delay(indice * 70).duration(480)}
                key={decision}
                style={[
                  styles.decision,
                  indice % 2 === 1 && styles.decisionDerecha,
                  !escritorio && styles.decisionMovil,
                  { transform: [{ rotate: `${indice % 2 === 0 ? -1.2 : 1.2}deg` }] },
                ]}
              >
                <View style={styles.decisionNumeroWrap}><Text style={styles.decisionNumero}>0{indice + 1}</Text></View>
                <Text style={styles.decisionTexto}>{decision}</Text>
                <Text style={styles.decisionFlecha}>{indice % 2 === 0 ? '↘' : '↙'}</Text>
              </Reanimated.View>
            ))}
          </View>
        </View>

        <View style={[styles.resultados, !escritorio && styles.resultadosColumna]}>
          <View style={styles.resultadosIntro}>
            <Trama clara style={styles.resultadosTrama} />
            <Text style={styles.resultadosMicro}>LO QUE QUEDÓ FUNCIONANDO</Text>
            <Text style={[styles.resultadosTitulo, movil && styles.resultadosTituloMovil]}>RESULTADOS</Text>
            <Text style={styles.resultadosNota}>menos promesa,{`\n`}más evidencia ↗</Text>
          </View>
          <View style={styles.resultadosStickers}>
            {caso.resultados.map((resultado, indice) => (
              <View key={resultado} style={[styles.resultadoSticker, indice === 1 && styles.resultadoStickerDos, indice === 2 && styles.resultadoStickerTres]}>
                <Text style={styles.resultadoNumero}>0{indice + 1}</Text>
                <Text style={styles.resultadoTexto}>{resultado}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.futuro, !escritorio && styles.futuroColumna]}>
          <View style={styles.futuroLado}>
            <Text style={styles.futuroLadoTexto}>NEXT{`\n`}VERSION</Text>
            <Text style={styles.futuroMas}>＋</Text>
            <Trama clara style={styles.futuroTrama} />
          </View>
          <View style={styles.futuroContenido}>
            <Etiqueta roja>SI LO HICIERA OTRA VEZ</Etiqueta>
            <Text style={[styles.futuroTitulo, movil && styles.futuroTituloMovil]}>CAMBIARÍA ESTO.</Text>
            <Text style={styles.futuroTexto}>{caso.loQueCambiaria}</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Abrir siguiente caso: ${siguiente.titulo}`}
          onPress={() => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: siguiente.repo } })}
          style={({ pressed }) => [styles.siguiente, movil && styles.siguienteMovil, pressed && styles.siguientePresionado]}
        >
          <View>
            <Text style={styles.siguienteMicro}>SIGUIENTE PROYECTO / NO HAY MENÚ</Text>
            <Text style={[styles.siguienteTitulo, movil && styles.siguienteTituloMovil]}>{siguiente.titulo}</Text>
          </View>
          <View style={styles.siguienteCirculo}><Ionicons name="arrow-forward" size={29} color={AZUL} /></View>
          <Text style={styles.siguienteNota}>sigue bajando{`\n`}por aquí →</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>CASE / {caso.repo.toUpperCase()} / 2026</Text>
          <Pressable onPress={() => router.push('/')}><Text style={styles.footerLink}>VOLVER AL PORTFOLIO ↑</Text></Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: HIELO },
  scroll: { minHeight: '100%' },
  cabecera: { width: '100%', maxWidth: 1380, alignSelf: 'center', paddingHorizontal: 34 },
  paddingMovil: { paddingHorizontal: 17 },
  trama: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, overflow: 'hidden' },
  punto: { width: 3, height: 3, borderRadius: 2 },
  barraVentana: { height: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, backgroundColor: NEGRO },
  barraVentanaClara: { backgroundColor: HIELO, borderBottomWidth: 1.5, borderBottomColor: NEGRO },
  barraVentanaTitulo: { color: HIELO, fontFamily: MONO, fontSize: 6, fontWeight: '700', letterSpacing: 0.7 },
  barraVentanaTituloOscuro: { color: NEGRO },
  controlesVentana: { flexDirection: 'row', gap: 8 },
  controlVentana: { color: HIELO, fontFamily: MONO, fontSize: 10, fontWeight: '700' },
  controlVentanaOscuro: { color: NEGRO },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, backgroundColor: HIELO, borderWidth: 1.5, borderColor: NEGRO },
  etiquetaAzul: { backgroundColor: AZUL, borderColor: AZUL },
  etiquetaRoja: { backgroundColor: ROJO, borderColor: ROJO },
  etiquetaTexto: { color: NEGRO, fontFamily: MONO, fontSize: 7, fontWeight: '700', letterSpacing: 0.7 },
  etiquetaTextoClaro: { color: HIELO },
  boton: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 15, borderWidth: 1.5, borderColor: NEGRO },
  botonAzul: { backgroundColor: AZUL, borderColor: AZUL, borderBottomWidth: 5, borderBottomColor: AZUL_OSCURO },
  botonPresionado: { opacity: 0.78, transform: [{ translateY: 2 }] },
  botonTexto: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 0.6 },
  botonTextoClaro: { color: HIELO },
  nav: { minHeight: 102, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: NEGRO },
  navVolver: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  navLogo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 28 },
  navSlash: { color: AZUL },
  navRuta: { color: GRIS, fontFamily: MONO, fontSize: 7, fontWeight: '700', letterSpacing: 0.8 },
  navVivo: { paddingHorizontal: 10, paddingVertical: 7, backgroundColor: LILA, borderWidth: 1.5, borderColor: NEGRO },
  navVivoTexto: { color: AZUL, fontFamily: MONO, fontSize: 7, fontWeight: '700' },
  hero: { minHeight: 720, flexDirection: 'row', alignItems: 'center', gap: 48, paddingVertical: 56 },
  heroColumna: { minHeight: 0, flexDirection: 'column', alignItems: 'stretch', paddingVertical: 44 },
  heroTexto: { flex: 0.9, minWidth: 0 },
  heroEtiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 88, lineHeight: 89, textTransform: 'uppercase', marginTop: 21 },
  heroTituloSombra: { position: 'absolute', left: 6, top: 75, color: ROJO, fontFamily: DISPLAY, fontSize: 88, lineHeight: 89, textTransform: 'uppercase' },
  heroTituloMovil: { fontSize: 54, lineHeight: 56 },
  heroResumen: { maxWidth: 500, color: '#303039', fontFamily: MONO, fontSize: 11, lineHeight: 19, marginTop: 18, paddingLeft: 15, borderLeftWidth: 7, borderLeftColor: AZUL },
  heroAcciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 25 },
  heroMetrica: { position: 'relative', flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 31, paddingTop: 14, borderTopWidth: 2, borderTopColor: NEGRO },
  heroMetricaValor: { color: AZUL, fontFamily: DISPLAY, fontSize: 58, lineHeight: 60 },
  heroMetricaTexto: { maxWidth: 150, color: NEGRO, fontFamily: MONO, fontSize: 7, fontWeight: '700', lineHeight: 11, paddingBottom: 8 },
  heroMetricaNota: { marginLeft: 'auto', color: AZUL, fontFamily: MANO, fontSize: 17, lineHeight: 16, textAlign: 'right', transform: [{ rotate: '-5deg' }] },
  heroVisualWrap: { position: 'relative', flex: 1.1, minWidth: 0 },
  heroVisualSombra: { position: 'absolute', left: 11, top: 11, right: -11, bottom: -11, backgroundColor: AZUL, borderWidth: 2, borderColor: NEGRO },
  heroVisual: { width: '100%', aspectRatio: 1.12, overflow: 'hidden', backgroundColor: LILA, borderWidth: 2, borderColor: NEGRO },
  visualSiwo: { flex: 1, position: 'relative', justifyContent: 'center', padding: 22, overflow: 'hidden', backgroundColor: LILA },
  visualSiwoSombra: { position: 'absolute', left: 50, top: 47, right: 16, bottom: 28, backgroundColor: AZUL, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '4deg' }] },
  visualSiwoVentana: { width: '94%', alignSelf: 'center', aspectRatio: 1264 / 820, overflow: 'hidden', backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-2deg' }] },
  visualSiwoImagen: { width: '100%', flex: 1 },
  visualSiwoSello: { position: 'absolute', right: 18, bottom: 17, width: 86, height: 86, alignItems: 'center', justifyContent: 'center', borderRadius: 46, backgroundColor: ROJO, borderWidth: 2, borderColor: NEGRO, transform: [{ rotate: '8deg' }] },
  visualSiwoSelloTexto: { color: HIELO, fontFamily: DISPLAY, fontSize: 22, lineHeight: 21, textAlign: 'center' },
  visualNota: { position: 'absolute', left: 15, bottom: 13, color: NEGRO, fontFamily: MANO, fontSize: 19, transform: [{ rotate: '-6deg' }] },
  visualCodecut: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: AZUL },
  visualCodecutRatio: { position: 'absolute', left: -5, bottom: -43, color: LILA, fontFamily: DISPLAY, fontSize: 190, lineHeight: 200 },
  visualCodecutRatioMovil: { fontSize: 140, lineHeight: 150 },
  timeline: { position: 'absolute', left: '9%', right: '8%', top: '17%', paddingBottom: 12, backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-3deg' }] },
  timelineFila: { height: 36, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 7, marginHorizontal: 8, marginTop: 8, borderWidth: 1, borderColor: NEGRO },
  timelineNumero: { width: 18, color: NEGRO, fontFamily: MONO, fontSize: 6, fontWeight: '700' },
  timelineClip: { height: 21, backgroundColor: AZUL },
  timelineClipLila: { backgroundColor: LILA },
  timelineClipNegro: { flex: 1, height: 21, backgroundColor: NEGRO },
  timelineCursor: { position: 'absolute', top: 29, bottom: 9, left: '58%', width: 2, backgroundColor: ROJO },
  visualPlay: { position: 'absolute', right: 20, bottom: 18, width: 68, height: 68, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO },
  visualPortfolio: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: AZUL },
  visualPortfolioTexto: { position: 'absolute', left: -6, top: -10, color: '#0d169f', fontFamily: DISPLAY, fontSize: 92, lineHeight: 80 },
  visualPortfolioTextoMovil: { fontSize: 68, lineHeight: 61 },
  visualPortfolioRetrato: { position: 'absolute', width: '51%', aspectRatio: 0.82, right: '8%', bottom: -13, overflow: 'hidden', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '4deg' }] },
  visualPortfolioImagen: { width: '100%', height: '100%', filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.4)' : undefined },
  visualPortfolioPopup: { position: 'absolute', width: 175, left: '6%', bottom: '12%', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-5deg' }] },
  visualPortfolioPopupTexto: { color: NEGRO, fontFamily: DISPLAY, fontSize: 24, lineHeight: 25, padding: 13 },
  visualPortfolioTrama: { position: 'absolute', width: 160, height: 100, right: -5, top: 20 },
  visualCorreos: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: LILA },
  visualCorreosCsv: { position: 'absolute', right: -7, bottom: -38, color: '#aba6f2', fontFamily: DISPLAY, fontSize: 190, lineHeight: 200 },
  correoNodoA: { position: 'absolute', left: '12%', top: '14%', width: 82, height: 82, alignItems: 'center', justifyContent: 'center', backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-6deg' }] },
  correoNodoB: { position: 'absolute', right: '14%', top: '12%', width: 90, height: 90, alignItems: 'center', justifyContent: 'center', borderRadius: 48, backgroundColor: AZUL, borderWidth: 3, borderColor: NEGRO },
  correoNodoC: { position: 'absolute', right: '9%', bottom: '15%', width: 84, height: 84, alignItems: 'center', justifyContent: 'center', borderRadius: 45, backgroundColor: ROJO, borderWidth: 3, borderColor: NEGRO },
  correoLineaA: { position: 'absolute', left: '26%', top: '25%', width: '51%', height: 2, backgroundColor: NEGRO, transform: [{ rotate: '-8deg' }] },
  correoLineaB: { position: 'absolute', right: '17%', top: '27%', width: 2, height: '50%', backgroundColor: NEGRO, transform: [{ rotate: '-10deg' }] },
  correoTerminal: { position: 'absolute', left: '10%', right: '15%', top: '43%', backgroundColor: NEGRO, borderWidth: 3, borderColor: HIELO, transform: [{ rotate: '-2deg' }] },
  correoTerminalTexto: { color: '#bdc4ff', fontFamily: MONO, fontSize: 8, lineHeight: 18, padding: 13 },
  marquesina: { width: '105%', alignSelf: 'center', overflow: 'hidden', paddingVertical: 14, backgroundColor: AZUL, borderTopWidth: 2, borderBottomWidth: 2, borderColor: NEGRO, transform: [{ rotate: '-1.1deg' }] },
  marquesinaTexto: { color: HIELO, fontFamily: MONO, fontSize: 10, fontWeight: '700', letterSpacing: 1.1, textAlign: 'center' },
  historia: { position: 'relative', width: '100%', maxWidth: 1380, minHeight: 820, alignSelf: 'center', overflow: 'hidden', padding: 45, backgroundColor: LILA, borderBottomWidth: 3, borderBottomColor: NEGRO },
  historiaMovil: { minHeight: 930, padding: 18 },
  historiaNumeroGigante: { position: 'absolute', left: -20, bottom: -82, color: '#aaa5ef', fontFamily: DISPLAY, fontSize: 340, lineHeight: 350 },
  historiaNumeroGiganteMovil: { fontSize: 230, lineHeight: 240 },
  problemaPapel: { position: 'absolute', left: '7%', top: 82, width: '49%', minHeight: 390, padding: 32, backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-3deg' }] },
  problemaPapelMovil: { left: 24, right: 24, width: 'auto', top: 55, minHeight: 370 },
  historiaKicker: { color: AZUL, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  historiaTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 46, lineHeight: 48, marginTop: 22 },
  historiaTituloMovil: { fontSize: 37, lineHeight: 39 },
  historiaTexto: { color: '#303039', fontFamily: MONO, fontSize: 11, lineHeight: 19, marginTop: 20 },
  anotacionProblema: { position: 'absolute', right: 18, bottom: 15, color: AZUL, fontFamily: MANO, fontSize: 20, transform: [{ rotate: '-5deg' }] },
  solucionVentana: { position: 'absolute', right: '6%', bottom: 70, width: '53%', minHeight: 390, backgroundColor: AZUL, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '2.5deg' }] },
  solucionVentanaMovil: { left: 25, right: 25, bottom: 55, width: 'auto', minHeight: 390 },
  solucionContenido: { flex: 1, padding: 31 },
  solucionKicker: { color: '#bdc4ff', fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  solucionTitulo: { color: HIELO, fontFamily: DISPLAY, fontSize: 46, lineHeight: 48, marginTop: 22 },
  solucionTituloMovil: { fontSize: 37, lineHeight: 39 },
  solucionTexto: { color: '#e7e8ff', fontFamily: MONO, fontSize: 11, lineHeight: 19, marginTop: 20 },
  historiaTrama: { position: 'absolute', right: -8, top: 17, width: 200, height: 130 },
  historiaEstrella: { position: 'absolute', left: '51%', top: 34, color: AZUL, fontSize: 42 },
  notaAutor: { position: 'relative', width: '100%', maxWidth: 1120, minHeight: 310, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 24, padding: 35, marginVertical: 95 },
  notaAutorMovil: { minHeight: 470, flexDirection: 'column', alignItems: 'flex-start', padding: 20, marginVertical: 65 },
  notaAvatar: { width: 165, height: 165, overflow: 'hidden', borderRadius: 90, backgroundColor: LILA, borderWidth: 3, borderColor: NEGRO, transform: [{ rotate: '-6deg' }] },
  notaAvatarImagen: { width: '100%', height: '100%', filter: Platform.OS === 'web' ? 'grayscale(1) contrast(1.5)' : undefined },
  notaBurbuja: { flex: 1, backgroundColor: HIELO, borderWidth: 3, borderColor: NEGRO, borderBottomWidth: 9, borderBottomColor: AZUL, transform: [{ rotate: '1deg' }] },
  notaTexto: { color: NEGRO, fontFamily: MONO, fontSize: 15, lineHeight: 25, padding: 25 },
  notaTextoMovil: { fontSize: 12, lineHeight: 20, padding: 18 },
  notaHora: { color: GRIS, fontFamily: MONO, fontSize: 6, fontWeight: '700', textAlign: 'right', paddingHorizontal: 18, paddingBottom: 13 },
  notaManuscrita: { position: 'absolute', left: 3, bottom: 1, color: AZUL, fontFamily: MANO, fontSize: 20, lineHeight: 18, transform: [{ rotate: '-6deg' }] },
  decisiones: { width: '100%', maxWidth: 1380, alignSelf: 'center', paddingHorizontal: 34, paddingBottom: 110 },
  decisionesCabecera: { paddingBottom: 22, marginBottom: 38, borderBottomWidth: 3, borderBottomColor: NEGRO },
  decisionesKicker: { color: AZUL, fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  decisionesTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 72, lineHeight: 70, marginTop: 10 },
  decisionesTituloMovil: { fontSize: 47, lineHeight: 47 },
  decisionesLista: { gap: 18 },
  decision: { position: 'relative', width: '73%', minHeight: 145, flexDirection: 'row', alignItems: 'center', gap: 20, padding: 22, backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO, borderBottomWidth: 7, borderBottomColor: AZUL },
  decisionDerecha: { alignSelf: 'flex-end', backgroundColor: LILA },
  decisionMovil: { width: '100%' },
  decisionNumeroWrap: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 34, backgroundColor: AZUL, borderWidth: 2, borderColor: NEGRO },
  decisionNumero: { color: HIELO, fontFamily: DISPLAY, fontSize: 26 },
  decisionTexto: { flex: 1, color: NEGRO, fontFamily: MONO, fontSize: 10, lineHeight: 17 },
  decisionFlecha: { color: NEGRO, fontFamily: MONO, fontSize: 22 },
  resultados: { width: '100%', maxWidth: 1380, minHeight: 480, alignSelf: 'center', flexDirection: 'row', backgroundColor: NEGRO, borderTopWidth: 3, borderBottomWidth: 3, borderColor: NEGRO },
  resultadosColumna: { flexDirection: 'column' },
  resultadosIntro: { position: 'relative', flex: 0.9, justifyContent: 'center', overflow: 'hidden', padding: 45, backgroundColor: AZUL },
  resultadosTrama: { position: 'absolute', width: 240, height: 170, right: -10, top: -10 },
  resultadosMicro: { color: '#bdc4ff', fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  resultadosTitulo: { color: HIELO, fontFamily: DISPLAY, fontSize: 68, lineHeight: 71, marginTop: 11 },
  resultadosTituloMovil: { fontSize: 48, lineHeight: 50 },
  resultadosNota: { color: HIELO, fontFamily: MANO, fontSize: 22, lineHeight: 20, marginTop: 28, transform: [{ rotate: '-5deg' }] },
  resultadosStickers: { position: 'relative', flex: 1.1, minHeight: 430, backgroundColor: NEGRO },
  resultadoSticker: { position: 'absolute', left: '10%', top: '10%', width: 190, height: 150, justifyContent: 'space-between', padding: 18, backgroundColor: HIELO, borderWidth: 3, borderColor: HIELO, transform: [{ rotate: '-6deg' }] },
  resultadoStickerDos: { left: '47%', top: '26%', backgroundColor: LILA, borderColor: HIELO, transform: [{ rotate: '7deg' }] },
  resultadoStickerTres: { left: '20%', top: '56%', backgroundColor: ROJO, borderColor: HIELO, transform: [{ rotate: '3deg' }] },
  resultadoNumero: { color: AZUL, fontFamily: DISPLAY, fontSize: 36 },
  resultadoTexto: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700', lineHeight: 13 },
  futuro: { width: '100%', maxWidth: 1380, minHeight: 360, alignSelf: 'center', flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: NEGRO },
  futuroColumna: { flexDirection: 'column' },
  futuroLado: { position: 'relative', flex: 0.8, minHeight: 330, overflow: 'hidden', padding: 34, backgroundColor: NEGRO },
  futuroLadoTexto: { color: HIELO, fontFamily: DISPLAY, fontSize: 73, lineHeight: 68 },
  futuroMas: { position: 'absolute', right: 29, top: 22, color: ROJO, fontFamily: MONO, fontSize: 48 },
  futuroTrama: { position: 'absolute', width: 190, height: 130, right: -8, bottom: -6 },
  futuroContenido: { flex: 1.2, justifyContent: 'center', padding: 42, backgroundColor: LILA },
  futuroTitulo: { color: NEGRO, fontFamily: DISPLAY, fontSize: 51, lineHeight: 54, marginTop: 16 },
  futuroTituloMovil: { fontSize: 39, lineHeight: 41 },
  futuroTexto: { color: '#303039', fontFamily: MONO, fontSize: 11, lineHeight: 19, marginTop: 18 },
  siguiente: { position: 'relative', width: '100%', maxWidth: 1380, minHeight: 300, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 30, overflow: 'hidden', padding: 50, backgroundColor: AZUL, borderBottomWidth: 3, borderBottomColor: NEGRO },
  siguienteMovil: { minHeight: 360, padding: 25 },
  siguientePresionado: { backgroundColor: AZUL_OSCURO },
  siguienteMicro: { color: '#bdc4ff', fontFamily: MONO, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  siguienteTitulo: { color: HIELO, fontFamily: DISPLAY, fontSize: 75, lineHeight: 78, textTransform: 'uppercase', marginTop: 10 },
  siguienteTituloMovil: { maxWidth: 250, fontSize: 43, lineHeight: 45 },
  siguienteCirculo: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center', borderRadius: 42, backgroundColor: HIELO, borderWidth: 2, borderColor: NEGRO },
  siguienteNota: { position: 'absolute', right: 37, bottom: 23, color: HIELO, fontFamily: MANO, fontSize: 19, lineHeight: 18, textAlign: 'right', transform: [{ rotate: '-5deg' }] },
  footer: { width: '100%', maxWidth: 1380, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 15, paddingHorizontal: 34, paddingVertical: 29 },
  footerTexto: { color: GRIS, fontFamily: MONO, fontSize: 7, fontWeight: '700' },
  footerLink: { color: NEGRO, fontFamily: MONO, fontSize: 8, fontWeight: '700' },
  noEncontrado: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30, backgroundColor: HIELO },
  noEncontradoNumero: { color: AZUL, fontFamily: DISPLAY, fontSize: 140, lineHeight: 145 },
  noEncontradoTexto: { color: NEGRO, fontFamily: MONO, fontSize: 12, fontWeight: '700' },
});

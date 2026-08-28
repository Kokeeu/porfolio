import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerCasoProyecto, obtenerSiguienteProyecto } from '../../data/proyectos';

const GITHUB_USUARIO = 'Kokeeu';
const COLOR_HIELO = '#79c6d8';
const COLOR_FONDO = '#eef7fa';
const COLOR_PAPEL = '#f8fcfd';
const COLOR_TINTA = '#111111';
const FUENTE_TITULOS = Platform.OS === 'web' ? 'Anton' : undefined;
const FUENTE_TEXTO = Platform.OS === 'web' ? 'IBM Plex Mono' : undefined;

const TramaPuntos = ({ style }) => (
  <View pointerEvents="none" style={[estilos.tramaPuntos, style]}>
    {Array.from({ length: 88 }, (_, indice) => (
      <View key={indice} style={[estilos.puntoTrama, indice % 6 === 0 && estilos.puntoTramaGrande]} />
    ))}
  </View>
);

const MarcasCorte = () => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, estilos.marcasCorte]}>
    <View style={[estilos.corteH, estilos.corteSuperiorIzquierdoH]} />
    <View style={[estilos.corteV, estilos.corteSuperiorIzquierdoV]} />
    <View style={[estilos.corteH, estilos.corteSuperiorDerechoH]} />
    <View style={[estilos.corteV, estilos.corteSuperiorDerechoV]} />
    <View style={[estilos.corteH, estilos.corteInferiorIzquierdoH]} />
    <View style={[estilos.corteV, estilos.corteInferiorIzquierdoV]} />
    <View style={[estilos.corteH, estilos.corteInferiorDerechoH]} />
    <View style={[estilos.corteV, estilos.corteInferiorDerechoV]} />
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

const BotonEditorial = ({ children, onPress, principal = false, accessibilityLabel }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => [
      estilos.boton,
      principal && estilos.botonPrincipal,
      pressed && estilos.botonPresionado,
    ]}
  >
    {children}
  </Pressable>
);

const EtiquetaFirma = ({ children }) => (
  <View style={estilos.etiquetaFirma}>
    <Text style={estilos.slashEtiqueta}>/</Text>
    <Text style={estilos.etiqueta}>{children}</Text>
  </View>
);

const EstadoNoEncontrado = ({ volver }) => (
  <View style={estilos.estadoNoEncontrado}>
    <Text style={estilos.numeroError}>404</Text>
    <Text style={estilos.tituloError}>ARCHIVO NO ENCONTRADO</Text>
    <Text style={estilos.descripcionError}>La ficha solicitada no forma parte de esta edición.</Text>
    <BotonEditorial principal onPress={volver} accessibilityLabel="Volver al portfolio">
      <Ionicons name="arrow-back" size={16} color="#f5fbfd" />
      <Text style={estilos.textoBotonPrincipal}>VOLVER AL ÍNDICE</Text>
    </BotonEditorial>
  </View>
);

export default function DetalleProyecto() {
  const parametros = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const esEscritorio = width >= 900;
  const esMovil = width < 720;
  const nombreParametro = Array.isArray(parametros.nombre) ? parametros.nombre[0] : parametros.nombre;
  const nombreProyecto = decodeURIComponent(nombreParametro || '');
  const caso = obtenerCasoProyecto(nombreProyecto);
  const siguiente = obtenerSiguienteProyecto(nombreProyecto);
  const [repositorio, setRepositorio] = useState(null);
  const [cargandoRepositorio, setCargandoRepositorio] = useState(Boolean(caso));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.backgroundColor = COLOR_FONDO;
    document.body.style.margin = '0';

    if (!document.getElementById('portfolio-fonts')) {
      const enlaceFuentes = document.createElement('link');
      enlaceFuentes.id = 'portfolio-fonts';
      enlaceFuentes.rel = 'stylesheet';
      enlaceFuentes.href = 'https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
      document.head.appendChild(enlaceFuentes);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    if (!caso) {
      setCargandoRepositorio(false);
      return undefined;
    }

    setRepositorio(null);
    setCargandoRepositorio(true);

    fetch(`https://api.github.com/repos/${GITHUB_USUARIO}/${caso.repo}`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('No se pudo cargar la ficha de GitHub');
        return respuesta.json();
      })
      .then((datos) => {
        if (activo) setRepositorio(datos);
      })
      .catch(() => {})
      .finally(() => {
        if (activo) setCargandoRepositorio(false);
      });

    return () => {
      activo = false;
    };
  }, [caso]);

  if (!caso) {
    return (
      <View style={estilos.pagina}>
        <EstadoNoEncontrado volver={() => router.replace('/')} />
        <StatusBar style="dark" />
      </View>
    );
  }

  const urlRepositorio = repositorio?.html_url || `https://github.com/${GITHUB_USUARIO}/${caso.repo}`;
  const urlDemo = repositorio?.homepage || caso.demo;
  const anoActualizacion = repositorio?.updated_at
    ? new Date(repositorio.updated_at).getFullYear()
    : '2026';
  const imagenProyecto = caso.repo === 'Siwo'
    ? require('../../assets/projects/siwo.png')
    : null;

  return (
    <View style={estilos.pagina}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: 36 }, (_, indice) => (
          <View
            key={indice}
            style={[
              estilos.lineaPapel,
              { top: `${indice * 2.8}%`, opacity: indice % 4 === 0 ? 0.045 : 0.018 },
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={estilos.contenidoScroll} showsVerticalScrollIndicator={false}>
        <View style={[estilos.contenedor, esMovil && estilos.contenedorMovil]}>
          <View style={[estilos.navegacion, esMovil && estilos.navegacionMovil]}>
            <Pressable
              onPress={() => router.push('/')}
              accessibilityRole="link"
              accessibilityLabel="Volver al portfolio"
              style={estilos.volver}
            >
              <Ionicons name="arrow-back" size={17} color={COLOR_TINTA} />
              <Text style={estilos.textoVolver}>VOLVER AL ÍNDICE</Text>
            </Pressable>
            <Text style={estilos.folioSuperior}>ARCHIVO / {caso.repo.toUpperCase()} · ACT. {anoActualizacion}</Text>
          </View>

          <Animated.View
            entering={FadeInDown.duration(650)}
            style={[estilos.hero, esEscritorio && estilos.heroEscritorio]}
          >
            <View style={[estilos.heroTexto, esEscritorio && estilos.heroTextoEscritorio]}>
              <EtiquetaFirma>CASO DE ESTUDIO · {caso.categoria}</EtiquetaFirma>
              <Text
                accessibilityRole="header"
                style={[
                  estilos.titulo,
                  esEscritorio && estilos.tituloEscritorio,
                  esMovil && estilos.tituloMovil,
                ]}
              >
                {caso.titulo}
              </Text>
              <Text style={estilos.resumen}>{caso.resumen}</Text>
              <View style={estilos.acciones}>
                {urlDemo && (
                  <BotonEditorial
                    principal
                    onPress={() => Linking.openURL(urlDemo)}
                    accessibilityLabel={`Abrir demo de ${caso.titulo}`}
                  >
                    <Text style={estilos.textoBotonPrincipal}>ABRIR PROYECTO</Text>
                    <MaterialCommunityIcons name="open-in-new" size={15} color="#f5fbfd" />
                  </BotonEditorial>
                )}
                <BotonEditorial
                  onPress={() => Linking.openURL(urlRepositorio)}
                  accessibilityLabel={`Ver código de ${caso.titulo}`}
                >
                  <FontAwesome5 name="github" size={15} color={COLOR_TINTA} />
                  <Text style={estilos.textoBoton}>VER CÓDIGO</Text>
                </BotonEditorial>
              </View>
            </View>

            <Animated.View
              entering={FadeIn.delay(180).duration(700)}
              style={[estilos.portadaCaso, esEscritorio && estilos.portadaCasoEscritorio]}
            >
              <MarcasCorte />
              <View style={estilos.cabeceraPortada}>
                <Text style={estilos.textoCabeceraPortada}>EDICIÓN 001</Text>
                <Text style={estilos.textoCabeceraPortada}>PÁG. 02</Text>
              </View>
              <TramaPuntos style={estilos.tramaPortada} />
              <MarcaRegistro style={estilos.registroPortada} />
              <Text style={estilos.metricaPrincipal}>{caso.metrica}</Text>
              <Text style={estilos.etiquetaMetrica}>{caso.etiquetaMetrica}</Text>
              <View style={estilos.listaStackPortada}>
                {caso.stack.map((tecnologia, indice) => (
                  <View key={tecnologia} style={estilos.filaStackPortada}>
                    <Text style={estilos.numeroStack}>0{indice + 1}</Text>
                    <Text style={estilos.textoStackPortada}>{tecnologia.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
              <Text style={estilos.textoVerticalPortada}>KOKEEU / SELECTED WORK</Text>
            </Animated.View>
          </Animated.View>

          <View style={estilos.fichaRapida}>
            <View style={estilos.celdaFicha}>
              <Text style={estilos.etiquetaFicha}>ROL</Text>
              <Text style={estilos.valorFicha}>DISEÑO + DESARROLLO</Text>
            </View>
            <View style={estilos.celdaFicha}>
              <Text style={estilos.etiquetaFicha}>STACK PRINCIPAL</Text>
              <Text style={estilos.valorFicha}>{caso.stack.slice(0, 2).join(' / ').toUpperCase()}</Text>
            </View>
            <View style={estilos.celdaFicha}>
              <Text style={estilos.etiquetaFicha}>ESTADO</Text>
              <Text style={estilos.valorFicha}>{cargandoRepositorio ? 'CONSULTANDO…' : 'ARCHIVADO / PÚBLICO'}</Text>
            </View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(70).duration(560)}
            style={[estilos.notaAutor, esEscritorio && estilos.notaAutorEscritorio]}
          >
            <View style={estilos.firmaNotaAutor}>
              <Text style={estilos.slashNotaAutor}>/</Text>
              <Text style={estilos.rotuloNotaAutor}>NOTA DE ANDERSON</Text>
            </View>
            <Text style={estilos.textoNotaAutor}>{caso.notaAutor}</Text>
          </Animated.View>

          {imagenProyecto && (
            <Animated.View entering={FadeInDown.duration(620)} style={estilos.bloqueCaptura}>
              <View style={estilos.cabeceraCaptura}>
                <Text style={estilos.textoCabeceraCaptura}>VISTA DEL PRODUCTO / CAPTURA OFICIAL</Text>
                <Text style={estilos.textoCabeceraCaptura}>FIG. 01</Text>
              </View>
              <View style={estilos.marcoCaptura}>
                <MarcasCorte />
                <Image
                  source={imagenProyecto}
                  style={estilos.imagenCaptura}
                  resizeMode="contain"
                  accessibilityLabel="Interfaz principal del buscador Siwö"
                />
              </View>
              <View style={estilos.pieCaptura}>
                <Text style={estilos.tituloPieCaptura}>SIWÖ / OPENINGS & ENDINGS DE ANIME</Text>
                <Text style={estilos.descripcionPieCaptura}>Búsqueda por título, temporada y año en una interfaz clara y centrada en el contenido.</Text>
              </View>
            </Animated.View>
          )}

          <View style={[estilos.doblePagina, esEscritorio && estilos.doblePaginaEscritorio]}>
            <Animated.View entering={FadeInDown.delay(80).duration(520)} style={estilos.panelTexto}>
              <Text style={estilos.numeroPanel}>01</Text>
              <EtiquetaFirma>EL CONFLICTO</EtiquetaFirma>
              <Text style={estilos.tituloPanel}>Lo que no estaba funcionando.</Text>
              <Text style={estilos.parrafoPanel}>{caso.problema}</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(150).duration(520)} style={[estilos.panelTexto, estilos.panelTextoAlterno]}>
              <Text style={estilos.numeroPanel}>02</Text>
              <EtiquetaFirma>LA DECISIÓN</EtiquetaFirma>
              <Text style={estilos.tituloPanel}>La respuesta que elegí.</Text>
              <Text style={estilos.parrafoPanel}>{caso.solucion}</Text>
            </Animated.View>
          </View>

          <View style={estilos.seccionDecisiones}>
            <View style={estilos.cabeceraSeccion}>
              <View>
                <EtiquetaFirma>TRAS BAMBALINAS · CRITERIO</EtiquetaFirma>
                <Text style={[estilos.tituloSeccion, esMovil && estilos.tituloSeccionMovil]}>LO QUE DECIDÍ</Text>
              </View>
              <Text style={estilos.numeroSeccion}>03</Text>
            </View>
            <View style={estilos.listaDecisiones}>
              {caso.decisiones.map((decision, indice) => (
                <View key={decision} style={estilos.decision}>
                  <Text style={estilos.indiceDecision}>{String(indice + 1).padStart(2, '0')}</Text>
                  <Text style={estilos.textoDecision}>{decision}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={estilos.seccionResultados}>
            <View style={estilos.etiquetaFirmaResultados}>
              <Text style={estilos.slashEtiqueta}>/</Text>
              <Text style={estilos.etiquetaResultados}>LO QUE FUNCIONÓ · EN TRES SEÑALES</Text>
            </View>
            <View style={[estilos.rejillaResultados, !esEscritorio && estilos.rejillaResultadosMovil]}>
              {caso.resultados.map((resultado, indice) => (
                <View key={resultado} style={estilos.resultado}>
                  <Text style={estilos.numeroResultado}>0{indice + 1}</Text>
                  <Text style={estilos.textoResultado}>{resultado}</Text>
                </View>
              ))}
            </View>
          </View>

          <Animated.View
            entering={FadeInDown.duration(560)}
            style={[estilos.proximaEdicion, esEscritorio && estilos.proximaEdicionEscritorio]}
          >
            <Text style={[estilos.slashProximaEdicion, esMovil && estilos.slashProximaEdicionMovil]}>/</Text>
            <View style={estilos.cuerpoProximaEdicion}>
              <Text style={estilos.rotuloProximaEdicion}>PRÓXIMA EDICIÓN · SIN MAQUILLAR</Text>
              <Text style={[estilos.tituloProximaEdicion, esMovil && estilos.tituloProximaEdicionMovil]}>Lo que cambiaría.</Text>
              <Text style={estilos.textoProximaEdicion}>{caso.loQueCambiaria}</Text>
            </View>
          </Animated.View>

          <Pressable
            onPress={() => router.push({ pathname: '/proyecto/[nombre]', params: { nombre: siguiente.repo } })}
            accessibilityRole="link"
            accessibilityLabel={`Leer el siguiente caso: ${siguiente.titulo}`}
            style={({ pressed }) => [estilos.siguienteCaso, pressed && estilos.siguienteCasoPresionado]}
          >
            <View>
              <Text style={estilos.etiquetaSiguiente}>SIGUIENTE CASO / CONTINÚA…</Text>
              <Text style={[estilos.tituloSiguiente, esMovil && estilos.tituloSiguienteMovil]}>{siguiente.titulo}</Text>
            </View>
            <Ionicons name="arrow-forward" size={30} color="#f5fbfd" />
          </Pressable>

          <View style={estilos.pie}>
            <Text style={estilos.textoPie}>© 2026 ANDERSON SOLANO CHAVARRÍA</Text>
            <Text style={estilos.textoPie}>CASO / {caso.repo.toUpperCase()}</Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: COLOR_FONDO },
  contenidoScroll: { paddingBottom: 36 },
  lineaPapel: { position: 'absolute', right: 0, left: 0, height: 1, backgroundColor: COLOR_TINTA },
  contenedor: { width: '100%', maxWidth: 1220, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 18 },
  contenedorMovil: { paddingHorizontal: 18, paddingTop: 10 },
  navegacion: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingBottom: 12, borderBottomWidth: 3, borderBottomColor: COLOR_TINTA },
  navegacionMovil: { minHeight: 56 },
  volver: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 8 },
  textoVolver: { color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  folioSuperior: { maxWidth: '55%', color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '800', letterSpacing: 0.7, textAlign: 'right' },
  hero: { gap: 30, paddingTop: 42, paddingBottom: 34 },
  heroEscritorio: { minHeight: 610, flexDirection: 'row', alignItems: 'stretch', gap: 44 },
  heroTexto: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: 16 },
  heroTextoEscritorio: { maxWidth: 650 },
  etiqueta: { color: COLOR_HIELO, fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  etiquetaFirma: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slashEtiqueta: { color: COLOR_HIELO, fontFamily: FUENTE_TITULOS, fontSize: 23, lineHeight: 24 },
  titulo: { maxWidth: 760, color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 72, lineHeight: 75, textTransform: 'uppercase', marginTop: 11 },
  tituloEscritorio: { fontSize: 106, lineHeight: 104, letterSpacing: -1 },
  tituloMovil: { fontSize: 58, lineHeight: 61 },
  resumen: { maxWidth: 610, color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 13, lineHeight: 21, marginTop: 20 },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 },
  boton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 15, borderWidth: 2, borderColor: COLOR_TINTA, backgroundColor: 'transparent' },
  botonPrincipal: { backgroundColor: COLOR_TINTA },
  botonPresionado: { opacity: 0.72, transform: [{ translateY: 2 }] },
  textoBoton: { color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  textoBotonPrincipal: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  portadaCaso: { position: 'relative', minHeight: 430, overflow: 'visible', padding: 24, backgroundColor: COLOR_PAPEL, borderWidth: 4, borderColor: COLOR_TINTA },
  portadaCasoEscritorio: { width: 420, minHeight: 520 },
  cabeceraPortada: { position: 'absolute', top: 0, right: 0, left: 0, height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: COLOR_TINTA },
  textoCabeceraPortada: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  tramaPuntos: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, overflow: 'hidden' },
  puntoTrama: { width: 2, height: 2, borderRadius: 1, backgroundColor: COLOR_TINTA, opacity: 0.36 },
  puntoTramaGrande: { width: 3, height: 3, opacity: 0.58 },
  tramaPortada: { position: 'absolute', top: 52, right: 12, width: 126, height: 100, opacity: 0.54, transform: [{ rotate: '5deg' }] },
  marcaRegistro: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', opacity: 0.52 },
  circuloRegistro: { position: 'absolute', width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: COLOR_TINTA },
  lineaRegistroHorizontal: { position: 'absolute', width: 30, height: 1, backgroundColor: COLOR_TINTA },
  lineaRegistroVertical: { position: 'absolute', width: 1, height: 30, backgroundColor: COLOR_TINTA },
  puntoRegistro: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLOR_HIELO },
  registroPortada: { position: 'absolute', right: 22, bottom: 22 },
  metricaPrincipal: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 102, lineHeight: 106, marginTop: 64 },
  etiquetaMetrica: { alignSelf: 'flex-start', color: '#f5fbfd', backgroundColor: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.8, paddingHorizontal: 8, paddingVertical: 5 },
  listaStackPortada: { marginTop: 'auto', marginBottom: 18, borderTopWidth: 2, borderLeftWidth: 2, borderColor: COLOR_TINTA },
  filaStackPortada: { minHeight: 34, flexDirection: 'row', alignItems: 'center', borderRightWidth: 2, borderBottomWidth: 2, borderColor: COLOR_TINTA },
  numeroStack: { width: 38, alignSelf: 'stretch', textAlign: 'center', textAlignVertical: 'center', color: '#f5fbfd', backgroundColor: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 16, paddingTop: 6 },
  textoStackPortada: { color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 0.5, paddingHorizontal: 10 },
  textoVerticalPortada: { position: 'absolute', right: -91, top: 240, width: 220, color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 1, transform: [{ rotate: '90deg' }] },
  marcasCorte: { zIndex: 5 },
  corteH: { position: 'absolute', width: 15, height: 1, backgroundColor: COLOR_TINTA },
  corteV: { position: 'absolute', width: 1, height: 15, backgroundColor: COLOR_TINTA },
  corteSuperiorIzquierdoH: { top: -7, left: -9 },
  corteSuperiorIzquierdoV: { top: -9, left: -7 },
  corteSuperiorDerechoH: { top: -7, right: -9 },
  corteSuperiorDerechoV: { top: -9, right: -7 },
  corteInferiorIzquierdoH: { bottom: -7, left: -9 },
  corteInferiorIzquierdoV: { bottom: -9, left: -7 },
  corteInferiorDerechoH: { right: -9, bottom: -7 },
  corteInferiorDerechoV: { right: -7, bottom: -9 },
  fichaRapida: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 56, borderTopWidth: 2, borderLeftWidth: 2, borderColor: COLOR_TINTA },
  celdaFicha: { flexGrow: 1, flexBasis: 220, minHeight: 68, justifyContent: 'center', padding: 12, borderRightWidth: 2, borderBottomWidth: 2, borderColor: COLOR_TINTA, backgroundColor: '#f5fbfd' },
  etiquetaFicha: { color: COLOR_HIELO, fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.8 },
  valorFicha: { color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 9, fontWeight: '900', letterSpacing: 0.4, marginTop: 5 },
  notaAutor: { position: 'relative', overflow: 'hidden', gap: 18, marginBottom: 56, paddingVertical: 24, paddingHorizontal: 22, borderTopWidth: 3, borderBottomWidth: 3, borderColor: COLOR_TINTA, backgroundColor: '#f5fbfd' },
  notaAutorEscritorio: { minHeight: 154, flexDirection: 'row', alignItems: 'stretch', gap: 34, paddingHorizontal: 30 },
  firmaNotaAutor: { minWidth: 172, flexDirection: 'row', alignItems: 'center', gap: 12 },
  slashNotaAutor: { color: COLOR_HIELO, fontFamily: FUENTE_TITULOS, fontSize: 84, lineHeight: 88 },
  rotuloNotaAutor: { maxWidth: 86, color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 8, lineHeight: 13, fontWeight: '900', letterSpacing: 1 },
  textoNotaAutor: { flex: 1, alignSelf: 'center', maxWidth: 750, color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 14, lineHeight: 23, fontWeight: '600' },
  bloqueCaptura: { marginTop: 8, marginBottom: 58 },
  cabeceraCaptura: { minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingHorizontal: 10, backgroundColor: COLOR_TINTA },
  textoCabeceraCaptura: { color: '#f5fbfd', fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  marcoCaptura: { position: 'relative', padding: 8, backgroundColor: COLOR_PAPEL, borderRightWidth: 3, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: COLOR_TINTA },
  imagenCaptura: { width: '100%', aspectRatio: 1264 / 771, backgroundColor: '#ffffff', filter: Platform.OS === 'web' ? 'saturate(0.94) contrast(1.02)' : undefined },
  pieCaptura: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingTop: 12 },
  tituloPieCaptura: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 22, lineHeight: 25 },
  descripcionPieCaptura: { maxWidth: 520, color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 8, lineHeight: 14 },
  doblePagina: { gap: 18 },
  doblePaginaEscritorio: { flexDirection: 'row' },
  panelTexto: { flex: 1, minHeight: 330, position: 'relative', overflow: 'hidden', justifyContent: 'flex-end', padding: 28, borderWidth: 3, borderColor: COLOR_TINTA, backgroundColor: COLOR_PAPEL },
  panelTextoAlterno: { backgroundColor: '#dfecef' },
  numeroPanel: { position: 'absolute', top: -24, right: 8, color: COLOR_HIELO, opacity: 0.75, fontFamily: FUENTE_TITULOS, fontSize: 118, lineHeight: 120 },
  tituloPanel: { maxWidth: 390, color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 34, lineHeight: 38, marginTop: 8 },
  parrafoPanel: { maxWidth: 500, color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 11, lineHeight: 19, marginTop: 14 },
  seccionDecisiones: { marginTop: 72 },
  cabeceraSeccion: { minHeight: 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, paddingBottom: 12, borderBottomWidth: 4, borderBottomColor: COLOR_TINTA },
  tituloSeccion: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 44, lineHeight: 49, marginTop: 5 },
  tituloSeccionMovil: { fontSize: 35, lineHeight: 39 },
  numeroSeccion: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 68, lineHeight: 68 },
  listaDecisiones: { borderLeftWidth: 2, borderColor: COLOR_TINTA },
  decision: { minHeight: 88, flexDirection: 'row', alignItems: 'stretch', borderRightWidth: 2, borderBottomWidth: 2, borderColor: COLOR_TINTA, backgroundColor: COLOR_PAPEL },
  indiceDecision: { width: 62, textAlign: 'center', textAlignVertical: 'center', color: '#f5fbfd', backgroundColor: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 25, paddingTop: 26 },
  textoDecision: { flex: 1, alignSelf: 'center', color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 10, lineHeight: 17, padding: 16 },
  seccionResultados: { marginTop: 64, padding: 24, backgroundColor: COLOR_TINTA },
  etiquetaFirmaResultados: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  etiquetaResultados: { color: COLOR_HIELO, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  rejillaResultados: { flexDirection: 'row', marginTop: 18, borderTopWidth: 1, borderLeftWidth: 1, borderColor: '#f5fbfd' },
  rejillaResultadosMovil: { flexDirection: 'column' },
  resultado: { flex: 1, minHeight: 116, justifyContent: 'space-between', padding: 14, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#f5fbfd' },
  numeroResultado: { color: COLOR_HIELO, fontFamily: FUENTE_TITULOS, fontSize: 22 },
  textoResultado: { color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 23, lineHeight: 27, textTransform: 'uppercase' },
  proximaEdicion: { position: 'relative', overflow: 'hidden', gap: 12, marginTop: 24, padding: 24, borderWidth: 3, borderColor: COLOR_TINTA, backgroundColor: '#dfecef' },
  proximaEdicionEscritorio: { minHeight: 250, flexDirection: 'row', alignItems: 'center', gap: 36, paddingHorizontal: 36 },
  slashProximaEdicion: { color: COLOR_HIELO, fontFamily: FUENTE_TITULOS, fontSize: 154, lineHeight: 160 },
  slashProximaEdicionMovil: { fontSize: 88, lineHeight: 88 },
  cuerpoProximaEdicion: { flex: 1, maxWidth: 780 },
  rotuloProximaEdicion: { color: COLOR_HIELO, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  tituloProximaEdicion: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 43, lineHeight: 47, marginTop: 5 },
  tituloProximaEdicionMovil: { fontSize: 35, lineHeight: 39 },
  textoProximaEdicion: { maxWidth: 720, color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 11, lineHeight: 19, marginTop: 12 },
  siguienteCaso: { minHeight: 190, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 64, padding: 28, backgroundColor: COLOR_TINTA, borderWidth: 4, borderColor: COLOR_TINTA },
  siguienteCasoPresionado: { backgroundColor: '#20333a' },
  etiquetaSiguiente: { color: COLOR_HIELO, fontFamily: FUENTE_TEXTO, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  tituloSiguiente: { maxWidth: 820, color: '#f5fbfd', fontFamily: FUENTE_TITULOS, fontSize: 54, lineHeight: 59, textTransform: 'uppercase', marginTop: 7 },
  tituloSiguienteMovil: { fontSize: 36, lineHeight: 40 },
  pie: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, paddingVertical: 28 },
  textoPie: { color: COLOR_TINTA, fontFamily: FUENTE_TEXTO, fontSize: 7, fontWeight: '900', letterSpacing: 0.6 },
  estadoNoEncontrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  numeroError: { color: COLOR_HIELO, fontFamily: FUENTE_TITULOS, fontSize: 120, lineHeight: 124 },
  tituloError: { color: COLOR_TINTA, fontFamily: FUENTE_TITULOS, fontSize: 38, textAlign: 'center' },
  descripcionError: { color: '#20333a', fontFamily: FUENTE_TEXTO, fontSize: 10, textAlign: 'center', marginTop: 10, marginBottom: 24 },
});

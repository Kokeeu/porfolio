import { Image, StyleSheet, View } from 'react-native';

const mascotSheet = require('../../../assets/mascots/portfolio-mascot-sheet.png');

export default function MascotSticker({ index = 0, label = 'Mascota original', size = 180, style }) {
  return (
    <View style={[styles.window, { width: size, height: size }, style]}>
      <Image
        source={mascotSheet}
        resizeMode="stretch"
        accessibilityLabel={label}
        style={{ position: 'absolute', top: 0, left: -index * size, width: size * 4, height: size }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  window: { overflow: 'hidden' },
});

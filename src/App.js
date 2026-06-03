import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View
} from "react-native";

const palette = {
  ink: "#f5f0e6",
  muted: "#9b9487",
  dim: "#6b665c",
  bg: "#080909",
  panel: "#101211",
  panel2: "#161816",
  line: "rgba(245, 240, 230, 0.12)",
  lineStrong: "rgba(245, 240, 230, 0.24)",
  mint: "#86b6a8",
  olive: "#a7aa70",
  rose: "#bd7b75",
  amber: "#c9a15b",
  slate: "#858ca2"
};

const ingredientGroups = {
  base: [
    { name: "Spark Charge", color: palette.mint, vibe: "crisp", price: 3.2, kcal: 35 },
    { name: "Citrus Volt", color: palette.olive, vibe: "tart", price: 3.4, kcal: 45 },
    { name: "Berry Pulse", color: palette.slate, vibe: "juicy", price: 3.6, kcal: 50 },
    { name: "Cold Brew Kick", color: "#8a705b", vibe: "bold", price: 3.8, kcal: 30 }
  ],
  secondary: [
    { name: "Blue Lime", color: "#799dae", vibe: "electric", price: 0.9, kcal: 25 },
    { name: "Strawberry Pop", color: palette.rose, vibe: "sweet", price: 1, kcal: 35 },
    { name: "Green Apple", color: "#82986e", vibe: "sharp", price: 0.8, kcal: 30 },
    { name: "Passionfruit", color: palette.amber, vibe: "tropical", price: 1.1, kcal: 40 }
  ],
  tertiary: [
    { name: "Mint Chill", color: "#96baa8", vibe: "cool", price: 0.55, kcal: 5 },
    { name: "Peach Foam", color: "#c49a86", vibe: "soft", price: 0.75, kcal: 45 },
    { name: "Ginger Snap", color: "#a77f49", vibe: "spicy", price: 0.65, kcal: 10 },
    { name: "Coconut Cloud", color: "#d4caba", vibe: "smooth", price: 0.85, kcal: 55 }
  ],
  quaternary: [
    { name: "Taurine Lift", color: "#bbb271", vibe: "focused", price: 0.7, kcal: 0 },
    { name: "Electrolytes", color: "#82aaa4", vibe: "hydrating", price: 0.6, kcal: 0 },
    { name: "B-Complex", color: "#b98355", vibe: "bright", price: 0.65, kcal: 0 },
    { name: "Collagen Shot", color: "#b992a7", vibe: "silky", price: 0.9, kcal: 20 }
  ]
};

const labels = {
  base: "Base",
  secondary: "Secondary",
  tertiary: "Tertiary",
  quaternary: "Quaternary"
};

const presets = [
  {
    name: "Neon Sunrise",
    picks: ["Citrus Volt", "Passionfruit", "Peach Foam", "B-Complex"],
    note: "Citrus, tropical, bright finish"
  },
  {
    name: "Midnight Volt",
    picks: ["Cold Brew Kick", "Blue Lime", "Mint Chill", "Taurine Lift"],
    note: "Bold caffeine with a cold mint edge"
  },
  {
    name: "Berry Static",
    picks: ["Berry Pulse", "Strawberry Pop", "Coconut Cloud", "Electrolytes"],
    note: "Creamy berry with a hydrating finish"
  }
];

const boosts = [
  { name: "Light Ice", price: 0, kcal: 0 },
  { name: "Extra Fizz", price: 0.25, kcal: 0 },
  { name: "Less Sweet", price: 0, kcal: -25 },
  { name: "Double Shot", price: 0.95, kcal: 0 }
];

const tabs = ["Build", "Mixes", "Card"];
const groups = Object.keys(ingredientGroups);
const member = { code: "OD-2479-86", level: 7, points: 740, next: 1000 };

function findIngredient(name) {
  return Object.values(ingredientGroups).flat().find(item => item.name === name);
}

function initialPicks() {
  return {
    base: ingredientGroups.base[0].name,
    secondary: ingredientGroups.secondary[0].name,
    tertiary: ingredientGroups.tertiary[0].name,
    quaternary: ingredientGroups.quaternary[0].name
  };
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function makeMixName(items) {
  return `${items[1].name.split(" ")[0]} ${items[3].name.split(" ")[0]}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Build");
  const [picks, setPicks] = useState(initialPicks);
  const [activeBoosts, setActiveBoosts] = useState(["Extra Fizz"]);
  const [saved, setSaved] = useState([]);

  const items = useMemo(() => groups.map(group => findIngredient(picks[group])), [picks]);
  const activeBoostItems = boosts.filter(boost => activeBoosts.includes(boost.name));
  const price = items.reduce((sum, item) => sum + item.price, 0) + activeBoostItems.reduce((sum, boost) => sum + boost.price, 0);
  const kcal = Math.max(0, items.reduce((sum, item) => sum + item.kcal, 0) + activeBoostItems.reduce((sum, boost) => sum + boost.kcal, 0));
  const mixName = makeMixName(items);
  const mixMeta = [...new Set(items.map(item => item.vibe))].slice(0, 4).join(" / ");

  function cyclePick(group) {
    const options = ingredientGroups[group];
    const current = options.findIndex(option => option.name === picks[group]);
    setPicks({ ...picks, [group]: options[(current + 1) % options.length].name });
  }

  function toggleBoost(name) {
    setActiveBoosts(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  }

  function applyPreset(preset) {
    setPicks({
      base: preset.picks[0],
      secondary: preset.picks[1],
      tertiary: preset.picks[2],
      quaternary: preset.picks[3]
    });
    setActiveTab("Build");
  }

  function saveMix() {
    setSaved(current => [{ id: Date.now(), name: mixName, items: items.map(item => item.name) }, ...current].slice(0, 6));
    setActiveTab("Card");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={palette.bg} />
      <View style={styles.app}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {activeTab === "Build" && (
            <>
              <Hero items={items} mixName={mixName} mixMeta={mixMeta} />
              <SectionHeader title="Formula" detail="tap to rotate" />
              <View style={styles.selectorStack}>
                {groups.map(group => (
                  <Pressable key={group} style={styles.selector} onPress={() => cyclePick(group)}>
                    <View style={[styles.outlineDot, { borderColor: findIngredient(picks[group]).color }]} />
                    <View style={styles.selectorCopy}>
                      <Text style={styles.selectorLabel}>{labels[group]}</Text>
                      <Text style={styles.selectorValue}>{picks[group]}</Text>
                    </View>
                    <Text style={styles.selectorMark}>+</Text>
                  </Pressable>
                ))}
              </View>

              <SectionHeader title="Boosts" detail={`${kcal} kcal`} />
              <View style={styles.boostGrid}>
                {boosts.map(boost => {
                  const active = activeBoosts.includes(boost.name);
                  return (
                    <Pressable key={boost.name} style={[styles.boost, active && styles.boostActive]} onPress={() => toggleBoost(boost.name)}>
                      <Text style={[styles.boostText, active && styles.activeText]}>{boost.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {activeTab === "Mixes" && (
            <>
              <PageTitle eyebrow="House mixes" title="Prepared systems" />
              <View style={styles.cardStack}>
                {presets.map(preset => (
                  <Pressable key={preset.name} style={styles.presetCard} onPress={() => applyPreset(preset)}>
                    <GeometricMini colors={preset.picks.map(findIngredient).map(item => item.color)} />
                    <View style={styles.presetCopy}>
                      <Text style={styles.cardTitle}>{preset.name}</Text>
                      <Text style={styles.cardText}>{preset.note}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {activeTab === "Card" && (
            <>
              <PageTitle eyebrow="Member profile" title="OD card" />
              <View style={styles.memberCard}>
                <View style={styles.memberTop}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
                  <View>
                    <Text style={styles.memberTitle}>Level {member.level}</Text>
                    <Text style={styles.cardText}>Nocturne Regular</Text>
                  </View>
                </View>
                <QrMark code={member.code} />
                <Text style={styles.memberCode}>{member.code}</Text>
                <View style={styles.progressMeta}>
                  <Text style={styles.smallText}>{member.points} points</Text>
                  <Text style={styles.smallText}>{member.next - member.points} to Level {member.level + 1}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round((member.points / member.next) * 100)}%` }]} />
                </View>
              </View>

              <SectionHeader title="Saved" detail={`${saved.length} mixes`} />
              <View style={styles.cardStack}>
                {saved.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.cardTitle}>No saved mixes yet</Text>
                    <Text style={styles.cardText}>Your custom drinks will land here.</Text>
                  </View>
                ) : saved.map(item => (
                  <View key={item.id} style={styles.emptyCard}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardText}>{item.items.join(" + ")}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {activeTab === "Build" && (
          <View style={styles.orderBar}>
            <View>
              <Text style={styles.orderLabel}>Total</Text>
              <Text style={styles.orderPrice}>{money(price)}</Text>
            </View>
            <Pressable style={styles.saveButton} onPress={saveMix}>
              <Text style={styles.saveText}>Save Mix</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.tabbar}>
          {tabs.map(tab => {
            const active = activeTab === tab;
            return (
              <Pressable key={tab} style={[styles.tab, active && styles.tabActive]} onPress={() => setActiveTab(tab)}>
                <View style={[styles.tabGlyph, active && styles.tabGlyphActive]} />
                <Text style={[styles.tabText, active && styles.activeText]}>{tab}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Hero({ items, mixName, mixMeta }) {
  return (
    <View style={styles.hero}>
      <AestheticGraphic />
      <View style={styles.heroCopy}>
        <Text style={styles.eyebrow}>OD</Text>
        <Text style={styles.heroTitle}>Office of Drinks</Text>
        <Text style={styles.heroSub}>Build your own energy drink system.</Text>
      </View>
      <View style={styles.mixPlate}>
        <LineCup items={items} />
        <View style={styles.mixCopy}>
          <Text style={styles.mixName}>{mixName}</Text>
          <Text style={styles.mixMeta}>{mixMeta}</Text>
        </View>
      </View>
    </View>
  );
}

function AestheticGraphic() {
  return (
    <View pointerEvents="none" style={styles.graphic}>
      <View style={[styles.gLine, styles.gLineOne]} />
      <View style={[styles.gLine, styles.gLineTwo]} />
      <View style={[styles.gLine, styles.gLineThree]} />
      <View style={[styles.gCircle, styles.gCircleOne]} />
      <View style={[styles.gCircle, styles.gCircleTwo]} />
      <View style={[styles.gBox, styles.gBoxOne]} />
      <View style={[styles.gBox, styles.gBoxTwo]} />
      <View style={[styles.gDot, styles.gDotOne]} />
      <View style={[styles.gDot, styles.gDotTwo]} />
      <View style={[styles.gDot, styles.gDotThree]} />
    </View>
  );
}

function LineCup({ items }) {
  return (
    <View style={styles.cup}>
      {items.map((item, index) => (
        <View
          key={item.name}
          style={[
            styles.cupLine,
            { borderColor: item.color, top: 20 + index * 22, width: 48 + index * 8 }
          ]}
        />
      ))}
      <View style={styles.cupStem} />
    </View>
  );
}

function GeometricMini({ colors }) {
  return (
    <View style={styles.mini}>
      <View style={[styles.miniCircle, { borderColor: colors[0] }]} />
      <View style={[styles.miniLine, { borderColor: colors[1] }]} />
      <View style={[styles.miniBox, { borderColor: colors[2] }]} />
      <View style={[styles.miniDot, { backgroundColor: colors[3] }]} />
    </View>
  );
}

function QrMark({ code }) {
  const cells = useMemo(() => {
    let seed = code.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return Array.from({ length: 121 }, (_, index) => {
      const x = index % 11;
      const y = Math.floor(index / 11);
      const corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      seed = (seed * 9301 + 49297) % 233280;
      return corner || (seed + x * 7 + y * 13) % 5 < 2;
    });
  }, [code]);

  return (
    <View style={styles.qr}>
      {cells.map((filled, index) => (
        <View key={index} style={[styles.qrCell, filled && styles.qrCellFilled]} />
      ))}
    </View>
  );
}

function SectionHeader({ title, detail }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDetail}>{detail}</Text>
    </View>
  );
}

function PageTitle({ eyebrow, title }) {
  return (
    <View style={styles.pageTitle}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.pageHeading}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg
  },
  app: {
    flex: 1,
    backgroundColor: palette.bg
  },
  scroll: {
    paddingBottom: 138
  },
  hero: {
    minHeight: 392,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.bg
  },
  graphic: {
    ...StyleSheet.absoluteFillObject
  },
  gLine: {
    position: "absolute",
    height: 1,
    backgroundColor: palette.lineStrong
  },
  gLineOne: {
    top: 136,
    left: 26,
    width: 260,
    transform: [{ rotate: "-15deg" }]
  },
  gLineTwo: {
    top: 228,
    right: 24,
    width: 242,
    transform: [{ rotate: "18deg" }]
  },
  gLineThree: {
    bottom: 92,
    left: 84,
    width: 184
  },
  gCircle: {
    position: "absolute",
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 999
  },
  gCircleOne: {
    top: 88,
    right: 28,
    width: 126,
    height: 126
  },
  gCircleTwo: {
    bottom: 84,
    left: 28,
    width: 68,
    height: 68
  },
  gBox: {
    position: "absolute",
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 12
  },
  gBoxOne: {
    top: 122,
    left: 44,
    width: 82,
    height: 54
  },
  gBoxTwo: {
    right: 68,
    bottom: 80,
    width: 98,
    height: 66
  },
  gDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 999
  },
  gDotOne: {
    top: 118,
    left: 164,
    backgroundColor: palette.amber
  },
  gDotTwo: {
    right: 44,
    bottom: 132,
    backgroundColor: palette.mint
  },
  gDotThree: {
    top: 242,
    left: 68,
    backgroundColor: palette.rose
  },
  heroCopy: {
    paddingHorizontal: 22,
    paddingTop: 28
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  heroTitle: {
    marginTop: 6,
    color: palette.ink,
    fontSize: 42,
    lineHeight: 43,
    fontWeight: "900"
  },
  heroSub: {
    marginTop: 12,
    maxWidth: 240,
    color: palette.muted,
    fontSize: 15,
    lineHeight: 21
  },
  mixPlate: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    backgroundColor: "rgba(16, 18, 17, 0.78)"
  },
  cup: {
    width: 86,
    height: 112,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center"
  },
  cupLine: {
    position: "absolute",
    left: 18,
    height: 0,
    borderTopWidth: 3,
    borderRadius: 999
  },
  cupStem: {
    position: "absolute",
    bottom: 13,
    width: 18,
    height: 18,
    borderBottomWidth: 1,
    borderColor: palette.lineStrong,
    transform: [{ rotate: "45deg" }]
  },
  mixCopy: {
    flex: 1
  },
  mixName: {
    color: palette.ink,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900"
  },
  mixMeta: {
    marginTop: 8,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  pageTitle: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 18
  },
  pageHeading: {
    marginTop: 6,
    color: palette.ink,
    fontSize: 36,
    fontWeight: "900"
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  sectionDetail: {
    color: palette.dim,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  selectorStack: {
    gap: 10,
    paddingHorizontal: 22
  },
  selector: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    backgroundColor: palette.panel
  },
  outlineDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2
  },
  selectorCopy: {
    flex: 1
  },
  selectorLabel: {
    color: palette.dim,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  selectorValue: {
    marginTop: 3,
    color: palette.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  selectorMark: {
    color: palette.muted,
    fontSize: 24,
    fontWeight: "300"
  },
  boostGrid: {
    paddingHorizontal: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  boost: {
    width: "48%",
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    backgroundColor: palette.panel
  },
  boostActive: {
    borderColor: palette.mint,
    backgroundColor: "rgba(134, 182, 168, 0.12)"
  },
  boostText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: "800"
  },
  activeText: {
    color: palette.ink
  },
  cardStack: {
    gap: 12,
    paddingHorizontal: 22
  },
  presetCard: {
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    backgroundColor: palette.panel
  },
  presetCopy: {
    flex: 1
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  cardText: {
    marginTop: 6,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  mini: {
    width: 78,
    height: 78,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18
  },
  miniCircle: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 26,
    height: 26,
    borderWidth: 2,
    borderRadius: 999
  },
  miniLine: {
    position: "absolute",
    right: 10,
    top: 28,
    width: 34,
    borderTopWidth: 2,
    transform: [{ rotate: "-18deg" }]
  },
  miniBox: {
    position: "absolute",
    left: 18,
    bottom: 12,
    width: 34,
    height: 22,
    borderWidth: 2,
    borderRadius: 7
  },
  miniDot: {
    position: "absolute",
    right: 14,
    bottom: 17,
    width: 10,
    height: 10,
    borderRadius: 999
  },
  memberCard: {
    marginHorizontal: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 22,
    backgroundColor: palette.panel2
  },
  memberTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 18
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 999
  },
  avatarText: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  memberTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  qr: {
    alignSelf: "center",
    width: 176,
    height: 176,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 18,
    backgroundColor: "#0b0d0c"
  },
  qrCell: {
    width: 13.2,
    height: 13.2,
    margin: 0.1,
    borderRadius: 2
  },
  qrCellFilled: {
    backgroundColor: palette.ink
  },
  memberCode: {
    marginTop: 14,
    color: palette.ink,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900"
  },
  progressMeta: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  smallText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  progressTrack: {
    height: 9,
    marginTop: 9,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(245, 240, 230, 0.10)"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.mint
  },
  emptyCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    backgroundColor: palette.panel
  },
  orderBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 80,
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 20,
    backgroundColor: "rgba(16, 18, 17, 0.96)"
  },
  orderLabel: {
    color: palette.dim,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  orderPrice: {
    marginTop: 2,
    color: palette.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  saveButton: {
    minWidth: 122,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: palette.ink
  },
  saveText: {
    color: palette.bg,
    fontSize: 14,
    fontWeight: "900"
  },
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: palette.line,
    backgroundColor: "rgba(8, 9, 9, 0.96)"
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 16
  },
  tabActive: {
    backgroundColor: "rgba(245, 240, 230, 0.06)"
  },
  tabGlyph: {
    width: 22,
    height: 8,
    borderWidth: 1,
    borderColor: palette.lineStrong,
    borderRadius: 999
  },
  tabGlyphActive: {
    borderColor: palette.mint,
    backgroundColor: "rgba(134, 182, 168, 0.18)"
  },
  tabText: {
    color: palette.dim,
    fontSize: 12,
    fontWeight: "800"
  }
});

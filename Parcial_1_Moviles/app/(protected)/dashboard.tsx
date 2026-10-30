import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { PokemonPlaceholder } from "../../src/Pokedex/models/pokedex.model";
import { useTrainerProfile } from "../../src/Pokedex/viewmodels/use-trainer-profile";

export default function DashboardScreen() {
  const router = useRouter();
  const { trainer, activeTab, setActiveTab } = useTrainerProfile();

  const renderPokemon = ({ item }: { item: PokemonPlaceholder }) => (
    <View style={styles.pokemonCard}>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.pokemonImage}
          accessibilityLabel={item.name}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageHint}>IMAGE</Text>
          <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Pokedex</Text>
        <TouchableOpacity
          accessibilityLabel="Log out"
          onPress={() => router.replace("/(public)")}
        >
          <Feather name="log-out" size={24} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3-P_VM_jGXZnWzYI7vc9mS2z3cx44hHmD03UFjirUYtkma0hMSLvG0Us&s=10" }}
            style={styles.avatar}
            accessibilityLabel="Ash Ketchum profile photo"
          />
          <View style={styles.stats}>
            <Stat value={trainer.stats.badges} label="Badges" />
            <Stat value={trainer.stats.pokemon} label="Pokemon" />
            <Stat value={trainer.stats.wins} label="Wins" />
          </View>
        </View>
        <Text style={styles.name}>{trainer.name}</Text>
        <Text style={styles.bio}>{trainer.biography}</Text>
      </View>

      <View style={styles.tabs}>
        <Tab
          icon="grid"
          active={activeTab === "grid"}
          onPress={() => setActiveTab("grid")}
        />
        <Tab
          icon="user"
          active={activeTab === "profile"}
          onPress={() => setActiveTab("profile")}
        />
      </View>

      {activeTab === "grid" ? (
        <FlatList
          data={trainer.pokemon}
          renderItem={renderPokemon}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
        />
      ) : (
        <View style={styles.profilePlaceholder}>
          <Text style={styles.profilePlaceholderText}>Trainer profile</Text>
        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab("grid")}>
          <Feather
            name="grid"
            size={25}
            color={activeTab === "grid" ? "#1F1F1F" : "#777777"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("profile")}>
          <FontAwesome6 name="user-large" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Tab({
  icon,
  active,
  onPress,
}: {
  icon: "grid" | "user";
  active: boolean;
  onPress: () => void;
}) {
  const iconColor = icon === "user" ? "#694a45" : "#1F1F1F";
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.activeTab]}
      onPress={onPress}
    >
      <Feather name={icon} size={25} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  
  title: { fontSize: 32, fontWeight: "800", color: "#1F1F1F" },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },

  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#F6F6F6",
  },

  imageHint: { fontSize: 10, fontWeight: "700", color: "#777777" },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 12,
  },

  stat: { alignItems: "center" },
  statValue: { fontSize: 21, fontWeight: "800", color: "#1F1F1F" },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#71524f",
    marginTop: 3,
  },

  name: { fontSize: 22, fontWeight: "800", color: "#1F1F1F", marginTop: 18 },
  bio: { fontSize: 16, lineHeight: 22, color: "#1F1F1F", marginTop: 4 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },

  activeTab: { borderBottomColor: "#1F1F1F" },
  grid: { padding: 1, flexGrow: 1 },
  gridRow: { gap: 1 },
  pokemonCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
  },

  pokemonImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  pokemonName: { fontSize: 12, fontWeight: "700", color: "#1F1F1F" },
  profilePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profilePlaceholderText: { color: "#777777", fontSize: 16 },
  bottomNav: {
    height: 68,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E1E1E1",
    backgroundColor: "#FFFFFF",
  },
});

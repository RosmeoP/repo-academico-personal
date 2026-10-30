import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { useDrawer } from "../src/Admin/viewmodels/use-drawer";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

function DrawerContent(props: any) {
  const router = useRouter();
  const { profile, navigationOptions } = useDrawer();
  const { clearSession } = useAuth();
  const [isInventoryExpanded, setInventoryExpanded] = useState(false);

  const activeIndex = props.state.index;
  const activeRouteName = props.state.routeNames[activeIndex];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.infoUser}>
          <Image
            style={styles.avatar}
            source={{ uri: profile.avatarUrl }}
          />
          <View style={styles.headerUser}>
            <Text style={styles.adminName}>{profile.name}</Text>
            <Text style={styles.adminRole}>{profile.role}</Text>
          </View>
        </View>
        <View style={styles.versionTag}>
          <Text>{profile.version}</Text>
        </View>
      </View>
      <View style={styles.menuList}>
        {navigationOptions.map((option: any) => {
          const isSelected = activeRouteName === option.name;
          const hasSubitems = !!option.subitems;

          return (
            <View key={option.name}>
              <TouchableOpacity
                style={[
                  styles.menuItemList,
                  isSelected && styles.menuItemSelected,
                ]}
                onPress={() => {
                  if (hasSubitems) {
                    setInventoryExpanded((current) => !current);
                  } else {
                    router.push(`/(protected)/${option.name}` as any);
                  }
                }}
              >
                <Feather
                  name={option.icon as any}
                  size={20}
                  color={isSelected ? "#FFF" : "#374151"}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuText}>{option.label}</Text>
                {hasSubitems && (
                  <Feather
                    name={isInventoryExpanded ? "chevron-down" : "chevron-right"}
                    size={16}
                    color={isSelected ? "#FFF" : "#374151"}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>

              {hasSubitems &&
                isInventoryExpanded &&
                option.subitems?.map((sub: any) => {
                  const isSubSelected = activeRouteName === sub.name;

                  return (
                    <TouchableOpacity
                      key={sub.name}
                      style={[
                        styles.menuItemList,
                        { paddingLeft: 40 },
                        isSubSelected && styles.menuItemSelected,
                      ]}
                      onPress={() => router.push(`/(protected)/${sub.name}` as any)}
                    >
                      <Feather
                        name={sub.icon as any}
                        size={16}
                        color={isSubSelected ? "#FFF" : "#4b5563"}
                        style={styles.menuIcon}
                      />
                      <Text style={[styles.menuText, { fontSize: 14 }, isSubSelected && styles.menuTextSelected]}>
                        {sub.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.logOutButton} onPress={clearSession}>
        <Feather
          name="log-out"
          size={20}
          color="#EF4444"
          style={styles.menuIcon}
        />
        <Text style={styles.logOutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{
          headerTintColor: "#006C47",
        }}
        drawerContent={DrawerContent}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
  },

  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "flex-start",
  },

  infoUser: {
    flexDirection: "row",
  },

  avatar: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },

  headerUser: {
    marginLeft: 15,
    marginTop: 5,
  },

  adminName: {
    fontSize: 20,
    color: "#006C47",
    fontWeight: "bold",
  },

  adminRole: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "bold",
  },

  versionTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: "#D1D5DB",
    paddingVertical: 2,
    marginTop: 8,
    borderRadius: 12,
  },

  menuList: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
  },

  menuItemList: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginVertical: 4,
  },

  menuItemSelected: {
    backgroundColor: "#00B074",
  },

  menuIcon: {
    marginRight: 15,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
  },

  menuTextSelected: {
    color: "#FFF",
  },

  logOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 15,
  },

  logOutText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF4444",
  },
});

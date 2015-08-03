package org.kubi.plugins.smartfridgerepeatrealtime.brain.util;

import java.util.Comparator;
import java.util.Map;
import java.util.TreeSet;

/**
 * Created by assaad on 08/04/15.
 */
public class SortingMap {
    public static <K,V extends Comparable<? super V>> java.util.SortedSet<Map.Entry<K,V>> entriesSortedByValues(Map<K,V> map) {
        java.util.SortedSet<Map.Entry<K,V>> sortedEntries = new TreeSet<Map.Entry<K,V>>(
                new Comparator<Map.Entry<K,V>>() {
                    @Override public int compare(Map.Entry<K,V> e1, Map.Entry<K,V> e2) {
                        int res = e2.getValue().compareTo(e1.getValue());
                        return res != 0 ? res : 1;
                    }
                }
        );
        sortedEntries.addAll(map.entrySet());
        return sortedEntries;
    }

}
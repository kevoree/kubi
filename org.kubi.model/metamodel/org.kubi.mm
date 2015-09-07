with version "1-SNAPSHOT"
with kmfVersion "4.19.1-SNAPSHOT"

class org.kubi.Ecosystem {
    att name: String
    rel groupes: org.kubi.Group
    rel technologies: org.kubi.Technology
}

class org.kubi.Group {
    att name: String
    rel groupes: org.kubi.Group
    rel devices: org.kubi.Device with opposite "groupes"
}

class org.kubi.Device {
    att id: String
    att homeId: String
    att available : Bool
    rel groupes: org.kubi.Group with opposite "devices"
    rel links: org.kubi.Device
    att name: String
    rel technology: org.kubi.Technology with maxBound 1
    rel stateParameters: org.kubi.StateParameter
    rel actionParameters: org.kubi.ActionParameter
    rel productType: org.kubi.Product with maxBound 1
}

enum org.kubi.ParameterType {
    list, byte, short, bool, int, button, decimal, string
}

class org.kubi.StateParameter {
    att name: String
    att value: String
    att valueType: String
    att precision: Double
    att unit: String
    att range: String
}

class org.kubi.ActionParameter extends org.kubi.StateParameter {
    att desired: String
}

class org.kubi.Technology {
    att name: String
    rel devices: org.kubi.Device with opposite "technology"
    rel catalog: org.kubi.Catalog with maxBound 1
}

class org.kubi.Catalog {
    rel manufacturers: org.kubi.Manufacturer with maxBound 1
}

class org.kubi.Manufacturer {
    att name: String
    att id: Int
    rel products: org.kubi.Product
}

class org.kubi.Product {
    att id: Int
    att name: String
    att version: String
    att pictureUrl: String
    rel manufacturer: org.kubi.Manufacturer with opposite "products" with maxBound 1
    rel devices: org.kubi.Device with opposite "productType"
}

class org.kubi.ZWaveProduct extends org.kubi.Product {
    rel commandClasses: org.kubi.zwave.CommandClass
    att type: Int
    att configUrl: String
    att loaded: Bool
}

class org.kubi.zwave.CommandClass {
    att id: Int
    rel parameters: org.kubi.zwave.Parameter
    rel associations: org.kubi.zwave.Association
}

class org.kubi.zwave.Parameter {
    att type: org.kubi.ParameterType
    att name: String
    att help: String
    att genre: String
    att instance: Int
    att index: Int
    att label: String
    att value: String
    att min: Long
    att min: Long
    att max: Long
    att size: Int
    rel items: org.kubi.zwave.ParameterItem
}

class org.kubi.zwave.Association {
    att numGroups: Int
    rel groups: org.kubi.zwave.AssociationGroup
}

class org.kubi.zwave.AssociationGroup {
    att index: Int
    att maxAssociations: Int
    att label: String
    att auto: Bool
}

class org.kubi.zwave.ParameterItem {
    att label: String
    att value: Int
}
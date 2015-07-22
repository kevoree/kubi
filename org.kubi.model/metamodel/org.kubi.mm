class org.kubi.Ecosystem {
    @id
    name : String
    @contained
    groupes : org.kubi.Group[0,*]
    @contained
    technologies : org.kubi.Technology[0,*]
}

class org.kubi.Group {
    @id
    name : String
    @contained
    groupes : org.kubi.Group[0,*]
    devices : org.kubi.Device[0,*] oppositeOf groupes
}

class org.kubi.Device {
    @id
    id : String
    homeId : String
    groupes : org.kubi.Group[0,*] oppositeOf devices

    links : org.kubi.Device[0,*]
    name : String
    picture : String
    version : String
    manufacturer : String
    technology : org.kubi.Technology
    @contained
    stateParameters : org.kubi.StateParameter[0,*]
    @contained
    actionParameters : org.kubi.ActionParameter[0,*]
    productType : org.kubi.Product
}

enum org.kubi.ParameterType {
list
byte
short
bool
int
button
decimal
string
}

class org.kubi.StateParameter {
    name : String
    value : String
    valueType : String
    precision : Double
    unit : String
    range : String
}

class org.kubi.ActionParameter : org.kubi.StateParameter {
    desired : String
}

class org.kubi.Technology {
    @id
    name : String
    @contained
    devices : org.kubi.Device[0,*] oppositeOf technology

    catalog : org.kubi.Catalog
}

class org.kubi.Catalog {

    @contained
    manufacturers : org.kubi.Manufacturer[0,*]
}

class org.kubi.Manufacturer {
    name : String
    id : Int
    @contained
    products : org.kubi.Product[0,*]
}

class org.kubi.Product {
    id : Int
    name : String
}

class org.kubi.ZWaveProduct : org.kubi.Product {
    @contained
    commandClasses : org.kubi.zwave.CommandClass[0,*]
    type : Int
}

class org.kubi.zwave.CommandClass {
    id : Int
    @contained
    parameters : org.kubi.zwave.Parameter[0,*]
    @contained
    associations : org.kubi.zwave.Association[0,*]
}

class org.kubi.zwave.Parameter {
    type : org.kubi.ParameterType
    name : String
    help : String
    genre : String
    instance : Int
    index : Int
    label : String
    value : String
    min : Long
    min : Long
    max : Long
    size : Int
    @contained
    items : org.kubi.zwave.ParameterItem[0,*]
}

class org.kubi.zwave.Association {
    numGroups : Int
    @contained
    groups : org.kubi.zwave.AssociationGroup[0,*]
}

class org.kubi.zwave.AssociationGroup {
    index : Int
    maxAssociations : Int
    label : String
    auto : Bool
}

class org.kubi.zwave.ParameterItem {
    label : String
    value : Int
}
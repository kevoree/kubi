


class org.kubi.zwave.ProductStore {
    @contained manufacturers : org.kubi.zwave.Manufacturer[0,*]
}

class org.kubi.zwave.Manufacturer {
    name : String
    id : Int
    @contained products : org.kubi.zwave.Product[0,*]
}

class org.kubi.zwave.Product {
    id : Int
    type : Int
    name : String
    @contained commandClasses : org.kubi.zwave.CommandClass[0,*]
}

class org.kubi.zwave.CommandClass {
    id : Int
    @contained parameters : org.kubi.zwave.Parameter[0,*]
    @contained associations : org.kubi.zwave.Association[0,*]
}


class org.kubi.zwave.Parameter {
    type : org.kubi.zwave.ParameterType
    name : String
    help : String
    genre : String
    instance : Int
    index : Int
    label : String
    value : String
    min : Int
    max : Int
    size : Int
    @contained items : org.kubi.zwave.ParameterItem[0,*]
}

class org.kubi.zwave.Association {
    numGroups : Int
    @contained groups : org.kubi.zwave.AssociationGroup[0,*]
}

class org.kubi.zwave.AssociationGroup {
    index : Int
    maxAssociations : Int
    label : String
    auto : Bool
}

enum org.kubi.zwave.ParameterType {
list
byte
short
bool
int
button
decimal
}

class org.kubi.zwave.ParameterItem {
    label : String
    value : Int
}

class org.kevoree.kubi.KubiModel  {
    @contained
    nodes : org.kevoree.kubi.Node[0,*]
    @contained
    groupes : org.kevoree.kubi.Group[0,*]
    @contained
    technologies : org.kevoree.kubi.Technology[0,*]
    @contained
    functions : org.kevoree.kubi.Function[0,*]
}

class org.kevoree.kubi.Node  {
    @id
    id : String
    brand : String
    name : String
    picture : String
    version : String
    technology : org.kevoree.kubi.Technology
    @contained
    services : org.kevoree.kubi.Service[0,*]
    links : org.kevoree.kubi.Node[0,*]
    @contained
    parameters : org.kevoree.kubi.Parameter[0,*]
}

class org.kevoree.kubi.Group  {
    @id
    name : String
}

class org.kevoree.kubi.Technology  {
    @id
    name : String
}

class org.kevoree.kubi.Service  {
    name : String
    function : org.kevoree.kubi.Function
    state : org.kevoree.kubi.Parameter
}

class org.kevoree.kubi.Function  {
    name : String
    @contained
    parameters : org.kevoree.kubi.Parameter[0,*]
}

class org.kevoree.kubi.Gateway : org.kevoree.kubi.Node {
}

class org.kevoree.kubi.Parameter  {
    name : String
    value : String
    valueType : String
    precision : Float
    unit : String
    range : String
}

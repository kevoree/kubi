class org.kubi.Ecosystem {
    @id
    name : String
    @contained
    groupes : org.kubi.Group[0,*]
    @contained
    devices : org.kubi.Device[0,*]
    @contained
    technologies : org.kubi.Technology[0,*]
}

class org.kubi.Group {
    @id
    name : String
}

class org.kubi.Device {
    @id
    id : String

    links : org.kubi.Device[0,*]
    name : String
    picture : String
    version : String
    manufacturer : String
    technology : org.kubi.Technology
    @contained
    parameters : org.kubi.Parameter[0,*]
    @contained
    functions : org.kubi.Function[0,*]
}

class org.kubi.Parameter {
    name : String
    value : String
    // The value of the period at a time T is the period calculated between T and T+x (at the beginning of the segment).
    period : String
    valueType : String
    precision : Float
    unit : String
    range : String
}

class org.kubi.Function {
    name : String
    device : org.kubi.Device oppositeOf functions
    @contained
    returnType : org.kubi.Parameter
    @contained
    parameters : org.kubi.Parameter[0,*]
    func exec(jsonInput : String) : String
}

class org.kubi.Technology {
    @id
    name : String
    devices : org.kubi.Device[0,*] oppositeOf technology
}

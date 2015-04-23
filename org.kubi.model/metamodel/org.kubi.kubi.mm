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
}

class org.kubi.StateParameter {
    name : String
    value : String
    // The value of the period at a time T is the period calculated between T and T+x (at the beginning of the segment).
    period : String
    valueType : String
    precision : Float
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
}

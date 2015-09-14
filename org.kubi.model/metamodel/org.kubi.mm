class org.kubi.Ecosystem {
    att name : String
    rel groupes : org.kubi.Group
    rel technologies : org.kubi.Technology
    rel stateMachine : org.synoptic.StateMachine with maxBound 1
}

class org.kubi.Group {
    att name : String
    rel groupes : org.kubi.Group
    rel devices : org.kubi.Device with opposite "groupes"
}

class org.kubi.Device {
    att id : String
    att homeId : String
    rel groupes : org.kubi.Group with oppositeO "devices"

    rel links : org.kubi.Device with maxBound 1
    att name : String
    att picture : String
    att version : String
    att manufacturer : String
    rel technology : org.kubi.Technology with maxBound 1
    rel stateParameters : org.kubi.StateParameter
    rel actionParameters : org.kubi.ActionParameter
}

enum org.kubi.ParameterType {
list,
byte,
short,
bool,
int,
button,
decimal,
string
}

class org.kubi.StateParameter {
    att name : String
    att value : String
    att valueType : String
    att precision : Double
    att unit : String
    att range : String
    rel period : org.kubi.Period with maxBound 1

    // information for the process of the period
    att frequencyOfCalculation : Int
    att predictedPeriodMin : Int
    att predictedPeriodMax : Int
}

class org.kubi.ActionParameter extends org.kubi.StateParameter {
    att desired : String
}

class org.kubi.Technology {
    att name : String
    rel devices : org.kubi.Device with opposite "technology"
    rel catalog : org.kubi.Catalog with maxBound 1
}

///------ Simulation

class org.kubi.SimulatedParameter extends org.kubi.StateParameter {
    att valueUnredundant : String
}

class org.kubi.SimulatedLightParameter extends org.kubi.SimulatedParameter {
}

class org.kubi.SimulatedSwitchParameter extends org.kubi.SimulatedParameter {
}

class org.kubi.Period{
// The value of the period at a time T is the period calculated between T and T+x (at the beginning of the segment).
    att period : String
}



///------ Catalog and the list of products (ZWave and other)

class org.kubi.Catalog {

    rel manufacturers : org.kubi.Manufacturer
}

class org.kubi.Manufacturer {
    att name : String
    att id : Int
    rel products : org.kubi.Product
}

class org.kubi.Product {
    att id : Int
    att name : String
}

class org.kubi.ZWaveProduct extends org.kubi.Product {
    rel commandClasses : org.kubi.zwave.CommandClass
    att type : Int
}

class org.kubi.zwave.CommandClass {
    att id : Int
    rel parameters : org.kubi.zwave.Parameter
    rel associations : org.kubi.zwave.Association
}

class org.kubi.zwave.Parameter {
    att type : org.kubi.ParameterType
    att name : String
    att help : String
    att genre : String
    att instance : Int
    att index : Int
    att label : String
    att value : String
    att min : Long
    att min : Long
    att max : Long
    att size : Int
    rel items : org.kubi.zwave.ParameterItem
}

class org.kubi.zwave.Association {
    att numGroups : Int
    rel groups : org.kubi.zwave.AssociationGroup
}

class org.kubi.zwave.AssociationGroup {
    att index : Int
    att maxAssociations : Int
    att label : String
    att auto : Bool
}

class org.kubi.zwave.ParameterItem {
    att label : String
    att value : Int
}



// ----------------------------------------------------------------------------------------------------------------
// ----------------------------                 State machine model                    ----------------------------
// ----------------------------------------------------------------------------------------------------------------


class org.synoptic.StateMachine {
    att name : String
    rel currentState : org.synoptic.State with maxBound 1
    rel states : org.synoptic.State
}

class org.synoptic.State {
    att outCounter : Int
    att name : String
    rel fromTransition : org.synoptic.Transition
    rel toTransition : org.synoptic.Transition
    func canGoTo (stateName : String) : Bool
}

class org.synoptic.Transition {
    att probability :  Double
    att deltaMin: Long
    att deltaMax: Long
    rel fromState : org.synoptic.State with maxBound 1
    rel toState : org.synoptic.State with maxBound 1
}

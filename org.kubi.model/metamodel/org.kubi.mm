class org.kubi.Ecosystem {
    att name : String
    ref* groupes : org.kubi.Group
    ref* technologies : org.kubi.Technology
    ref stateMachine : org.synoptic.StateMachine
}

class org.kubi.Group {
    att name : String
    ref* groupes : org.kubi.Group
    ref* devices : org.kubi.Device with opposite "groupes"
}

class org.kubi.Device {
    att id : String
    att homeId : String
    ref* groupes : org.kubi.Group with oppositeO "devices"

    ref links : org.kubi.Device
    att name : String
    att picture : String
    att version : String
    att manufacturer : String
    ref technology : org.kubi.Technology
    ref* stateParameters : org.kubi.StateParameter
    ref* actionParameters : org.kubi.ActionParameter
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
    ref period : org.kubi.Period

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
    ref* devices : org.kubi.Device with opposite "technology"
    ref catalog : org.kubi.Catalog
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

    ref* manufacturers : org.kubi.Manufacturer
}

class org.kubi.Manufacturer {
    att name : String
    att id : Int
    ref* products : org.kubi.Product
}

class org.kubi.Product {
    att id : Int
    att name : String
}

class org.kubi.ZWaveProduct extends org.kubi.Product {
    ref* commandClasses : org.kubi.zwave.CommandClass
    att type : Int
}

class org.kubi.zwave.CommandClass {
    att id : Int
    ref* parameters : org.kubi.zwave.Parameter
    ref* associations : org.kubi.zwave.Association
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
    ref* items : org.kubi.zwave.ParameterItem
}

class org.kubi.zwave.Association {
    att numGroups : Int
    ref* groups : org.kubi.zwave.AssociationGroup
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
    ref currentState : org.synoptic.State
    ref* states : org.synoptic.State
}

class org.synoptic.State {
    att outCounter : Int
    att name : String
    ref* fromTransition : org.synoptic.Transition
    ref* toTransition : org.synoptic.Transition
    func canGoTo (stateName : String) : Bool
}

class org.synoptic.Transition {
    att probability :  Double
    att deltaMin: Long
    att deltaMax: Long
    ref fromState : org.synoptic.State
    ref toState : org.synoptic.State
}

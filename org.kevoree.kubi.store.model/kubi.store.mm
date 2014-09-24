
class org.kevoree.kubi.store.KubiStore  {
    @contained
    manufacturers : org.kevoree.kubi.store.Manufacturer[0,*]
    @contained
    technologies : org.kevoree.kubi.store.Technology[0,*]
    @contained
    products : org.kevoree.kubi.store.Product[0,*]
}

class org.kevoree.kubi.store.Manufacturer  {
    @id
    id : String
    name : String
    products : org.kevoree.kubi.store.Product[0,*] oppositeOf manufacturer
}

class org.kevoree.kubi.store.Technology  {
    @id
    name : String
    products : org.kevoree.kubi.store.Product[0,*] oppositeOf technology
}

class org.kevoree.kubi.store.Product  {
    id : String
    typeid : String
    name : String
    imgAddress : String
    technology : org.kevoree.kubi.store.Technology oppositeOf products
    manufacturer : org.kevoree.kubi.store.Manufacturer oppositeOf products
}

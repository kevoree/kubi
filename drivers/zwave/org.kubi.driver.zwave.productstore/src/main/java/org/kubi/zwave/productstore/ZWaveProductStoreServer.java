package org.kubi.zwave.productstore;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.ClassPathResourceManager;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.databases.websocket.WebSocketWrapper;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kubi.zwave.*;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.Attribute;
import javax.xml.stream.events.StartElement;
import javax.xml.stream.events.XMLEvent;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;

/**
 * Created by gregory.nain on 10/02/15.
 */
public class ZWaveProductStoreServer {


    private static final String DEFAULT_IP = "0.0.0.0";
    private static final int DEFAULT_PORT = 8283;

    private String currentIp;
    private int currentPort;

    private Undertow server;

    public ZWaveProductStoreServer() {
        this(DEFAULT_IP, DEFAULT_PORT);
    }

    public ZWaveProductStoreServer(String ip, int port) {
        this.currentIp = ip;
        this.currentPort = port;
    }

    public void start() {
        try {
            //start store.
            ZWaveProductsStoreModel storeModel = new ZWaveProductsStoreModel();
            storeModel.setContentDeliveryDriver(new WebSocketWrapper(new LevelDbContentDeliveryDriver("ZWaveProductsDb"), 23666));
            storeModel.connect().then(new Callback<Throwable>() {
                @Override
                public void on(Throwable throwable) {
                    final ZWaveProductsStoreUniverse universe = storeModel.universe(0);
                    ZWaveProductsStoreView baseView = universe.time(0);
                    baseView.select("/").then(new Callback<KObject[]>() {
                        public void on(KObject[] kObjects) {
                            if (kObjects == null || kObjects.length == 0) {
                                ProductStore store = baseView.createProductStore();
                                baseView.setRoot(store).then(new Callback<Throwable>() {
                                    public void on(Throwable throwable) {
                                        System.err.println("ProductStore Loading");
                                        load(store);
                                        storeModel.save().then(new Callback<Throwable>() {
                                            @Override
                                            public void on(Throwable throwable) {
                                                if (throwable != null) {
                                                    throwable.printStackTrace();
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                System.err.println("ProductStore root found");
                            }
                        }
                    });
                }
            });

            //serves pictures
            server = Undertow.builder()
                    .addHttpListener(currentPort, currentIp)
                    .setHandler(Handlers.path().addPrefixPath("/", Handlers.resource(new ClassPathResourceManager(this.getClass().getClassLoader(), "static")))).build();
            server.start();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void stop() {
        if (server != null) {
            server.stop();
        }
    }

    private static void load(ProductStore store) {
        String baseUrl = "http://open-zwave.googlecode.com/svn/trunk/config";
        try {
            URL url = new URL(baseUrl + "/manufacturer_specific.xml");
            URLConnection connection = url.openConnection();
            int fileLength = connection.getContentLength();
            if (fileLength == -1) {
                System.out.println("Invalide URL or file.");
                return;
            }
            XMLInputFactory inputFactory = XMLInputFactory.newInstance();
            InputStream input = connection.getInputStream();
            final XMLEventReader eventReader = inputFactory.createXMLEventReader(input);
            try {
                Manufacturer lastLoadedManufacturer = store.view().createManufacturer(); // void manufacturer
                while (eventReader.hasNext()) {
                    XMLEvent event = eventReader.nextEvent();
                    if (event.isStartElement()) {
                        StartElement startElt = event.asStartElement();
                        if (startElt.getName().getLocalPart().equals("Manufacturer")) {
                            lastLoadedManufacturer = store.view().createManufacturer();
                            Iterator<Attribute> attributes = startElt.getAttributes();
                            while (attributes.hasNext()) {
                                Attribute next = attributes.next();
                                if (next.getName().toString().equals("id")) {
                                    lastLoadedManufacturer.setId(Integer.parseInt(next.getValue(), 16));
                                } else if (next.getName().toString().equals("name")) {
                                    lastLoadedManufacturer.setName(next.getValue());
                                }
                            }
                            store.addManufacturers(lastLoadedManufacturer);
                        } else if (startElt.getName().getLocalPart().equals("Product")) {
                            Product product = store.view().createProduct();
                            Iterator<Attribute> attributes = startElt.getAttributes();
                            while (attributes.hasNext()) {
                                Attribute next = attributes.next();
                                String attrName = next.getName().toString();
                                if (attrName.equals("id")) {
                                    product.setId(Integer.parseInt(next.getValue(), 16));
                                } else if (attrName.equals("name")) {
                                    product.setName(next.getValue());
                                } else if (attrName.equals("type")) {
                                    product.setType(Integer.parseInt(next.getValue(), 16));
                                } else if (attrName.equals("config")) {
                                    //Log.warn("Ignored Configuration file:" + next.getValue() + " for product " + product.getName());
                                    parseConfiguration(baseUrl + "/" + next.getValue(), product);
                                }
                            }
                            lastLoadedManufacturer.addProducts(product);
                        }
                    }
                }
                //Updates
                addAeonMicroSmartSwitch(store);
            } catch (XMLStreamException e1) {
                e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        } catch (MalformedURLException e1) {
            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (XMLStreamException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private static void addAeonMicroSmartSwitch(ProductStore store) {

        store.select("/manufacturers[id=" + Integer.valueOf("0086") + "]").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                if (kObjects.length > 0) {
                    Manufacturer manufacturer = (Manufacturer) kObjects[0];
                    Product p2 = store.view().createProduct();
                    p2.setId(Integer.parseInt("1001", 16));
                    p2.setType(Integer.parseInt("0301", 16));
                    p2.setName("Roller Shutter 2");
                    manufacturer.addProducts(p2);
                }
            }
        });
    }

    private static void parseConfiguration(String stringUrl, Product product) {
        try {
            URL url = new URL(stringUrl);
            URLConnection connection = url.openConnection();
            int fileLength = connection.getContentLength();

            if (fileLength == -1) {
                System.out.println("Invalide URL or file.");
                return;
            }

            CommandClass currentCC = null;
            Parameter currentParameter = null;
            Association currentAssociation = null;

            XMLInputFactory inputFactory = XMLInputFactory.newInstance();
            InputStream input = connection.getInputStream();
            final XMLEventReader eventReader = inputFactory.createXMLEventReader(input);

            while (eventReader.hasNext()) {
                XMLEvent event = eventReader.nextEvent();
                if (event.isStartElement()) {
                    StartElement startElt = event.asStartElement();
                    if (startElt.getName().getLocalPart().equals("CommandClass")) {
                        CommandClass cc = product.view().createCommandClass();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while (attributes.hasNext()) {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();

                            if (attrName.equals("id")) {
                                cc.setId(Integer.parseInt(next.getValue(), 16));
                            }
                        }
                        product.addCommandClasses(cc);
                        currentCC = cc;

                    } else if (startElt.getName().getLocalPart().equals("Value")) {

                        Parameter param = product.view().createParameter();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while (attributes.hasNext()) {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();
                            if (!next.getValue().equals("")) {
                                if (attrName.equals("type")) {
                                    param.setType(ParameterType.valueOf(next.getValue().toUpperCase()));
                                } else if (attrName.equals("genre")) {
                                    param.setGenre(next.getValue());
                                } else if (attrName.equals("instance")) {
                                    param.setInstance(Integer.valueOf(next.getValue()));
                                } else if (attrName.equals("index")) {
                                    param.setIndex(Integer.valueOf(next.getValue()));
                                } else if (attrName.equals("label")) {
                                    param.setLabel(next.getValue());
                                } else if (attrName.equals("value")) {
                                    param.setValue(next.getValue());
                                } else if (attrName.equals("min")) {

                                    param.setMin(Integer.valueOf(next.getValue()));
                                } else if (attrName.equals("max")) {

                                    param.setMax(Integer.valueOf(next.getValue()));
                                } else if (attrName.equals("size")) {
                                    param.setSize(Integer.valueOf(next.getValue()));
                                }
                            }
                        }
                        currentCC.addParameters(param);
                        currentParameter = param;

                    } else if (startElt.getName().getLocalPart().equals("Help")) {
                        //help

                    } else if (startElt.getName().getLocalPart().equals("Item")) {
                        ParameterItem item = product.view().createParameterItem();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while (attributes.hasNext()) {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();
                            if (attrName.equals("label")) {
                                item.setLabel(next.getValue());
                            } else if (attrName.equals("value")) {
                                item.setValue(Integer.valueOf(next.getValue()));
                            }
                        }
                        currentParameter.addItems(item);
                    } else if (startElt.getName().getLocalPart().equals("Associations")) {
                        Association assoc = product.view().createAssociation();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while (attributes.hasNext()) {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();
                            if (attrName.equals("num_groups")) {
                                assoc.setNumGroups(Integer.valueOf(next.getValue()));
                            }
                        }
                        currentCC.addAssociations(assoc);
                        currentAssociation = assoc;
                    } else if (startElt.getName().getLocalPart().equals("Group")) {
                        AssociationGroup group = product.view().createAssociationGroup();

                        Iterator<Attribute> attributes = startElt.getAttributes();
                        while (attributes.hasNext()) {
                            Attribute next = attributes.next();
                            String attrName = next.getName().toString();
                            if (attrName.equals("label")) {
                                group.setLabel(next.getValue());
                            } else if (attrName.equals("index")) {
                                group.setIndex(Integer.valueOf(next.getValue()));
                            } else if (attrName.equals("max_associations")) {
                                group.setMaxAssociations(Integer.valueOf(next.getValue()));
                            } else if (attrName.equals("auto")) {
                                group.setAuto(Boolean.valueOf(next.getValue()));
                            }
                            currentAssociation.addGroups(group);
                        }
                    }
                }
            }


        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (XMLStreamException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

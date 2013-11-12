package org.kevoree.kubi.web;

import org.kevoree.kubi.store.KubiStore;
import org.kevoree.kubi.store.Manufacturer;
import org.kevoree.kubi.store.Product;
import org.kevoree.kubi.store.StoreFactory;
import org.kevoree.kubi.store.impl.DefaultStoreFactory;
import org.kevoree.kubi.store.model.HttpDataStore;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 12/11/2013
 * Time: 11:57
 * To change this template use File | Settings | File Templates.
 */
public class ProductsStoreManager {

    private StoreFactory factory;
    private HttpDataStore localDataStore;
    private KubiStore store;
    private static ProductsStoreManager INSTANCE;
    private String productStoreAddress = "http://localhost:8082";


    public static ProductsStoreManager getInstance() {
        if(INSTANCE == null) {
            INSTANCE = new ProductsStoreManager();
        }
        return INSTANCE;
    }

    public String getProductStoreAddress() {
        return productStoreAddress;
    }

    public void setProductStoreAddress(String productStoreAddress) {
        this.productStoreAddress = productStoreAddress;
        localDataStore = new HttpDataStore(productStoreAddress + "/datastore");
        factory.setDatastore(localDataStore);
        store = (KubiStore) factory.lookup("/");
    }

    public ProductsStoreManager() {
        factory = new DefaultStoreFactory();
        localDataStore = new HttpDataStore(productStoreAddress + "/datastore");
        factory.setDatastore(localDataStore);
        store = (KubiStore) factory.lookup("/");
    }


    public Manufacturer getManufacturerById(String manufacturerId) {
        Log.trace("[START]Find ManufacturerById");
        Manufacturer manufacturer = store.findManufacturersByID(manufacturerId);
        Log.trace("[STOP]Find ManufacturerById");
        return manufacturer;
    }


    public Product getProductById(Manufacturer manufacturer, String productId) {
        Log.trace("[START]Find ProductById");
        for(Product p : store.getProducts()) {
            if(p.getManufacturer() == manufacturer && ("" + p.getTypeid() + p.getId()).equalsIgnoreCase(productId)){
                return p;
            }
        }
        Log.trace("[STOP]Find ProductById");
        return null;
    }



}

import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { DevicesMongoDbPersistence } from '../persistence/DevicesMongoDbPersistence';
import { DevicesFilePersistence } from '../persistence/DevicesFilePersistence';
import { DevicesMemoryPersistence } from '../persistence/DevicesMemoryPersistence';
import { DevicesController } from '../logic/DevicesController';
import { DevicesHttpServiceV1 } from '../services/version1/DevicesHttpServiceV1';

export class DevicesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-devices", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-devices", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-devices", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-devices", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-devices", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-devices", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(DevicesServiceFactory.MemoryPersistenceDescriptor, DevicesMemoryPersistence);
		this.registerAsType(DevicesServiceFactory.FilePersistenceDescriptor, DevicesFilePersistence);
		this.registerAsType(DevicesServiceFactory.MongoDbPersistenceDescriptor, DevicesMongoDbPersistence);
		this.registerAsType(DevicesServiceFactory.ControllerDescriptor, DevicesController);
		this.registerAsType(DevicesServiceFactory.HttpServiceDescriptor, DevicesHttpServiceV1);
	}
	
}

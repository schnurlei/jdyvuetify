 // jdynameta, 
// Copyright (c)2012 Rainer Schneider, Roggenburg.
// Distributed under Apache 2.0 license
// http://jdynameta.de


/*jslint browser: true*/
/* jslint global $ alert */
"use strict";
// initialize global jdy namespace
const JDY = {};

JDY.inherit = (function () {

	var TempConstructor = function () {
	};

	return function (child, parent) {

		TempConstructor.prototype = parent.prototype;
		child.prototype = new TempConstructor();
		child.uber = parent.prototype;
		child.prototype.constructor = child;
	};

}());

export const JdyValidationError = function (message) {
    this.name = "ValidationError";
    this.message = message || "Validation Error";
};

export const JdyJdyPersistentException = function (message) {
    this.name = "JdyPersistentException";
    this.message = message || "JdyPersistentException";
};


JdyValidationError.prototype = new Error();
JdyValidationError.prototype.constructor = JdyValidationError;

export const JdyRepository = function (repositoryName) {
	this.repoName = repositoryName;
	this.classes = {};
};

JdyRepository.prototype.addClassInfo = function (aInternalName, aSuperclass) {

	var newClass = null;
	if (this.classes[aInternalName]) {
		throw new JdyValidationError("Class already exists with name: " + aInternalName);
	}

	newClass = new JdyClassInfo(aInternalName, this.repoName, aSuperclass);
	this.classes[aInternalName] = newClass;
	return newClass;
};

JdyRepository.prototype.getClassInfo = function (aInternalName) {
	return this.classes[aInternalName];
};

JdyRepository.prototype.addAssociation = function (anAssocName, aMasterClass, aDetailClass,
			aDetailInternalName, aDetailExternalName, keyInDetail, notNullInDetail, aIsDependent) {
	var newAssoc,
		detailToMasterAssoc;

	detailToMasterAssoc = new JdyObjectReferenceInfo(aDetailInternalName, aDetailExternalName,
								keyInDetail, notNullInDetail, aMasterClass);
	detailToMasterAssoc.setIsDependent(aIsDependent);
	detailToMasterAssoc.setIsInAssociation(true);
	aDetailClass.addReferenceToAttrList(detailToMasterAssoc);
	newAssoc = new JdyAssociationModel(detailToMasterAssoc, aDetailClass, anAssocName);
	aMasterClass.addAssociation(newAssoc);
};

export const JdyClassInfo = function (aInternalName, aRepoName, aSuperclass) {

	this.nameSpace = null;
	this.repoName = aRepoName;
	this.internalName = aInternalName;
	this.externalName = null;
	this.shortName = null;
	this.isAbstract = false;
	this.superclass = aSuperclass;
	if (this.superclass) {
		this.superclass.subclasses.push(this);
	}
	this.attributs = {};
	this.attrList = [];
	this.associations = {};
	this.assocList = [];
	this.subclasses = [];
};



JdyClassInfo.prototype.getSuperclass = function () {

	return this.superclass;
};


JdyClassInfo.prototype.forEachAttr = function (aFunc) {

	this.getAllAttributeList().forEach(aFunc);
};

JdyClassInfo.prototype.forEachAssoc = function (aFunc) {

	this.getAllAssociationList().forEach(aFunc);
};

JdyClassInfo.prototype.getAllAttributeList = function () {
	var tmpAttrList = this.attrList;

	if (this.superclass) {
		tmpAttrList = tmpAttrList.concat(this.superclass.getAllAttributeList());
	}

	return tmpAttrList;
};


JdyClassInfo.prototype.getAllAssociationList = function () {

	var tmpAssocList = this.assocList;

	if (this.superclass) {
		tmpAssocList = tmpAssocList.concat(this.superclass.getAllAssociationList());
	}

	return tmpAssocList;
};



JdyClassInfo.prototype.addAssociation = function (aAssoc) {

	if (this.associations[aAssoc.getAssocName()]) {
		throw new JdyValidationError("Associtaion already exists with name: " + aAssoc.getAssocName());
	}

	this.associations[aAssoc.getAssocName()] = aAssoc;
	this.assocList.push(aAssoc);
	return aAssoc;
};

JdyClassInfo.prototype.addReference = function (anInternalName, aReferencedClass) {

	var newAttr;
	newAttr = new JdyObjectReferenceInfo(anInternalName, anInternalName, false, false, aReferencedClass);
	this.addReferenceToAttrList(newAttr);
	return newAttr;
};


JdyClassInfo.prototype.addReferenceToAttrList = function (aObjRef) {

	if (this.attributs[aObjRef.getInternalName()]) {
		throw new JdyValidationError("Attribute already exists with name: " + aObjRef.getInternalName());
	}

	this.attributs[aObjRef.getInternalName()] = aObjRef;
	this.attrList.push(aObjRef);
};

JdyClassInfo.prototype.addPrimitiveAttr = function (aInternalName, aPrimitiveType) {

	var newAttr;
	if (this.attributs[aInternalName]) {
		throw new JdyValidationError("Attribute already exists with name: " + aInternalName);
	}

	newAttr = new JdyPrimitiveAttributeInfo(aInternalName, aInternalName, false, false, aPrimitiveType);
	this.attributs[aInternalName] = newAttr;
	this.attrList.push(newAttr);
	return newAttr;
};


JdyClassInfo.prototype.addTextAttr = function (aInternalName, aLength, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyTextType(aLength, null, aDomainValueList));
};

JdyClassInfo.prototype.addEmailAttr = function (aInternalName, aLength, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyTextType(aLength, JdyTextType.hint.EMAIL, aDomainValueList));
};

JdyClassInfo.prototype.addUrlAttr = function (aInternalName, aLength, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyTextType(aLength, JdyTextType.hint.URL, aDomainValueList));
};

JdyClassInfo.prototype.addTelephoneAttr = function (aInternalName, aLength, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyTextType(aLength, JdyTextType.hint.TELEPHONE, aDomainValueList));
};

JdyClassInfo.prototype.addBooleanAttr = function (aInternalName) {

	return this.addPrimitiveAttr(aInternalName, new JdyBooleanType());
};

JdyClassInfo.prototype.addVarCharAttr = function (aInternalName, aLength) {

	return this.addPrimitiveAttr(aInternalName, new JdyVarCharType(aLength, false));
};

JdyClassInfo.prototype.addDecimalAttr = function (aInternalName, aMinValue, aMaxValue, aScale, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyDecimalType(aMinValue, aMaxValue, aScale, aDomainValueList));
};

JdyClassInfo.prototype.addLongAttr = function (aInternalName, aMinValue, aMaxValue, aDomainValueList) {

	return this.addPrimitiveAttr(aInternalName, new JdyLongType(aMinValue, aMaxValue, aDomainValueList));
};

JdyClassInfo.prototype.addTimeStampAttr = function (aInternalName, isDatePartUsed, isTimePartUsed) {

	return this.addPrimitiveAttr(aInternalName, new JdyTimeStampType(isDatePartUsed, isTimePartUsed));
};

JdyClassInfo.prototype.addFloatAttr = function (aInternalName) {

	return this.addPrimitiveAttr(aInternalName, new JdyFloatType());
};

JdyClassInfo.prototype.addBlobAttr = function (aInternalName) {

	return this.addPrimitiveAttr(aInternalName, new JdyBlobType());
};

JdyClassInfo.prototype.getShortName = function () {

	return this.shortName;
};

JdyClassInfo.prototype.setShortName = function (aShortName) {
	this.shortName = aShortName;
	return this;
};

JdyClassInfo.prototype.setAbstract = function (newValue) {
	this.isAbstract = newValue;
	return this;
};

JdyClassInfo.prototype.getInternalName = function () {

	return this.internalName;
};

JdyClassInfo.prototype.getAssoc = function (aAssocName) {

	return this.associations[aAssocName];
};

JdyClassInfo.prototype.getAttr = function (aInternalName) {

	return this.attributs[aInternalName];
};

JdyClassInfo.prototype.getNameSpace = function () {

	return this.nameSpace;
};

JdyClassInfo.prototype.getRepoName = function () {

	return this.repoName;
};


JdyClassInfo.prototype.getAllSubclasses = function () {

	return this.subclasses;
};

const addSubclasses = function addSubclasses(aClassInfo, resultList) {

	var curSubclass, i;

	if (aClassInfo.getAllSubclasses() &&
			aClassInfo.getAllSubclasses().length > 0) {

		for (i = 0; i < aClassInfo.getAllSubclasses().length; i++) {
			curSubclass = aClassInfo.getAllSubclasses()[i];
			resultList.push(curSubclass);
			addSubclasses(curSubclass, resultList);
		}
	}
	return resultList;
};


JdyClassInfo.prototype.getSubclassesRec = function () {

	var resultList = [];

	JdyaddSubclasses(this, resultList);

	return resultList;
};



export const JdyAssociationModel = function (aMasterClassRef, aDetailClass, anAssocName) {

	this.detailClass = aDetailClass;
	this.masterClassReference = aMasterClassRef;
	this.assocName = anAssocName;
};

JdyAssociationModel.prototype.getAssocName = function () {

	return this.assocName;
};

JdyAssociationModel.prototype.getDetailClass = function () {

	return this.detailClass;
};

JdyAssociationModel.prototype.getMasterClassReference = function () {

	return this.masterClassReference;
};



export const JdyAttributeInfo = function (aInternalName,  aExternalName,  isKey, isNotNull) {

	this.internalName = aInternalName;
	this.externalName = aExternalName;
	this.key = isKey;
	this.isNotNull = isNotNull;
	this.isGenerated = null;
	this.attrGroup = null;
	this.pos = null;
};

JdyAttributeInfo.prototype.getInternalName = function () {

	return this.internalName;
};


JdyAttributeInfo.prototype.isPrimitive = function () {

    return (this.primitive) ? this.primitive : false;
};

JdyAttributeInfo.prototype.isKey = function () {

    return (this.key) ? this.key : false;
};

JdyAttributeInfo.prototype.setIsKey = function (isKey) {
	this.key = isKey;
	return this;
};

JdyAttributeInfo.prototype.setNotNull = function (isNotNull) {

	this.isNotNull = isNotNull;
	return this;
};

JdyAttributeInfo.prototype.setGenerated = function (isGenerated) {

	this.isGenerated = isGenerated;
	return this;
};


JdyAttributeInfo.prototype.setExternalName = function (aExternalName) {

	this.externalName = aExternalName;
	return this;
};

JdyAttributeInfo.prototype.setAttrGroup = function (anAttrGroup) {

	this.attrGroup = anAttrGroup;
	return this;
};

JdyAttributeInfo.prototype.setPos = function (aPos) {

	this.pos = aPos;
	return this;
};

export const JdyObjectReferenceInfo = function (aInternalName, aExternalName, isKeyFlag, isNotNullFlag, aReferencedClass) {

	JdyAttributeInfo.apply(this, arguments);
	this.referencedClass = aReferencedClass;
	this.inAssociation = null;
	this.dependent = null;
	this.primitive = false;
};

JDY.inherit(JdyObjectReferenceInfo, JdyAttributeInfo);

JdyObjectReferenceInfo.prototype.getReferencedClass = function () {

	return this.referencedClass;
};



JdyObjectReferenceInfo.prototype.setIsDependent = function (isDependent) {

	this.dependent = isDependent;
	return this;
};

JdyObjectReferenceInfo.prototype.setIsInAssociation = function (inAssociation) {

	this.inAssociation = inAssociation;
	return this;
};


export const JdyPrimitiveAttributeInfo = function (aInternalName,  aExternalName,  isKey, isNotNull, aType) {

	JdyAttributeInfo.apply(this, arguments);
	this.type = aType;
	this.primitive = true;
};

JDY.inherit(JdyPrimitiveAttributeInfo, JdyAttributeInfo);

JdyAttributeInfo.prototype.getType = function () {

	return this.type;
};

export const JdyPrimitiveType = function () {
};

export const JdyBlobType = function () {
	this.typeHint = null;
	this.$type = "BlobType";
};

JdyBlobType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleBlob(this);
};

export const JdyFloatType = function () {
	this.$type = "FloatType";
};

JdyFloatType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleFloat(this);
};

export const JdyBooleanType = function () {

	this.$type = "BooleanType";
};

JdyBooleanType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleBoolean(this);

};


export const JdyLongType = function (aMinValue, aMaxValue, aDomainValueList) {

	this.minValue = aMinValue;
	this.maxValue = aMaxValue;
	this.domainValues = aDomainValueList;
	this.$type = "LongType";

};

JdyLongType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleLong(this);
};

export const JdyDecimalType = function (aMinValue, aMaxValue, aScale, aDomainValueList) {

	this.minValue = aMinValue;
	this.maxValue = aMaxValue;
	this.scale = aScale;
	this.domainValues = aDomainValueList;
	this.$type = "DecimalType";
	
};

JdyDecimalType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleDecimal(this);
};

export const JdyTextType = function (aLength, aTypeHint, aDomainValueList) {

	this.length = aLength;
	this.typeHint = aTypeHint;
	this.domainValues = [];
	this.domainValues = aDomainValueList;
	this.$type = "TextType";
};

JdyTextType.hint = {};
JdyTextType.hint.EMAIL = "EMAIL";
JdyTextType.hint.TELEPHONE = "TELEPHONE";
JdyTextType.hint.URL = "URL";

JdyTextType.prototype.setTypeHint = function(aTypeHint) {
	this.typeHint = aTypeHint;
};

JdyTextType.prototype.handlePrimitiveKey = function (aHandler) {

    return aHandler.handleText(this);
};

export const JdyTimeStampType = function (isDatePartUsed, isTimePartUsed) {

    this.datePartUsed = isDatePartUsed;
    this.timePartUsed = isTimePartUsed;
	this.$type = "TimeStampType";
};

JdyTimeStampType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleTimeStamp(this);
};


export const JdyVarCharType = function (aLength, isClobFlag) {

	this.length = aLength;
	this.mimeType = null;
	this.clob = isClobFlag;
	this.$type = "VarCharType";

};

JdyVarCharType.prototype.handlePrimitiveKey = function (aHandler) {

	return aHandler.handleVarChar(this);
};


export const JdyObjectList = function (anAssocInfo) {

	this.assocObj = anAssocInfo;
	this.objects = [];

};

JdyObjectList.prototype.done = function (anCallback) {
	
	anCallback(this.objects);
};

JdyObjectList.prototype.add = function (anValueObject) {
	
	this.objects.push(anValueObject);
};

export const JdyProxyObjectList = function (anAssocInfo, aProxyResolver, aMasterObj) {

	this.objects = null;
	this.assocObj = anAssocInfo;
	this.proxyResolver = aProxyResolver;
	this.masterObject = aMasterObj;
	this.promise = null;

};
JdyProxyObjectList.prototype.done = function (anCallback) {
	
	var dfrd,
		that = this;
	
	if(!this.promise) {

        dfrd = $.Deferred();
        this.promise = dfrd.promise();
        if(this.proxyResolver) {
            
            this.proxyResolver.resolveAssoc(that.assocObj,that.masterObject, function(aAssocList){
				that.objects = aAssocList;
				dfrd.resolve(aAssocList);
            });
        } else {
          dfrd.reject("Proxy Error: no proxy resolver " + assocName);		
        }
    }
	
	this.promise.done(anCallback);
};

JdyProxyObjectList.prototype.add = function (anValueObject) {
	
	this.objects.push(anValueObject);
};

export const JdyTypedValueObject = function (aClassInfo, aProxyResolver, asProxy) {
	
	var that = this;
	this.$typeInfo = aClassInfo;
	this.$assocs = {};
	this.$proxyResolver = aProxyResolver;
	
	if(asProxy) {
		this.$proxy = {};
	}
	
	aClassInfo.forEachAttr(function (curAttrInfo) {

		that[curAttrInfo.getInternalName()] = null;
	});

	aClassInfo.forEachAssoc(function (curAssocInfo) {

		that.$assocs[curAssocInfo.getAssocName()] = new JdyProxyObjectList(curAssocInfo, that.$proxyResolver, that);
	});
};

JdyTypedValueObject.prototype.setAssocVals = function (anAssoc, anObjectList) {

    var assocName = (typeof anAssoc === "string") ? anAssoc : anAssoc.getAssocName();
	this.$assocs[assocName] = anObjectList;
};

JdyTypedValueObject.prototype.assocVals = function (anAssoc) {

    var assocName = (typeof anAssoc === "string") ? anAssoc : anAssoc.getAssocName(),
		assocObj = this.$assocs[assocName];
    return assocObj;
};

JdyTypedValueObject.prototype.val = function (anAttr) {

	return this[(typeof anAttr === "string") ? anAttr : anAttr.getInternalName()];
};

JdyTypedValueObject.prototype.setVal = function (anAttr, aValue) {

	this[anAttr.getInternalName()] = aValue;
};

JdyTypedValueObject.prototype.setProxyVal = function (anAttr, aValue) {

	this.$proxy[anAttr.getInternalName()] = aValue;
};

export const JdyClassInfoQuery = function (aTypeInfo, aFilterExpr) {
	this.resultType = aTypeInfo;
	this.filterExpression = aFilterExpr;
};

JdyClassInfoQuery.prototype.getResultInfo = function () {
	return this.resultInfo;
};

JdyClassInfoQuery.prototype.matchesObject = function (aModel) {
	return this.filterExpression === null
			|| this.filterExpression.matchesObject(aModel);	
};

JdyClassInfoQuery.prototype.getFilterExpression = function () {
	return this.filterExpression;
};

JdyClassInfoQuery.prototype.setFilterExpression  = function (aExpression) {
	filterExpression = aExpression;
};

export const JdyAndExpression = function(aExprVect){

	this.expressionVect = aExprVect;
	this.$exprType = "AndExpression";
};

JdyAndExpression.prototype.visit = function (aVisitor){
	return aVisitor.visitAndExpression(this);
};

JdyAndExpression.prototype.matchesObject = function ( aModel ) {
		
	var matches = true;
	for (i = 0; i < this.expressionVect.length; i++) {
		matches = this.expressionVect[i].matchesObject(aModel);
	}
	return matches;
};
	

export const JdyOrExpression = function(aExprVect){

	this.expressionVect = aExprVect;
	this.$exprType = "OrExpression";
};

JdyOrExpression.prototype.visit = function (aVisitor){
	return aVisitor.visitOrExpression(this);
};

JdyOrExpression.prototype.matchesObject = function ( aModel ) {
		
	var matches = true;
	for (i = 0; i < this.expressionVect.length; i++) {
		matches = this.expressionVect[i].matchesObject(aModel);
	}
	return matches;
};


export const JdyOperatorExpression = function(aExprVect){

	this.myOperator = aExprVect;
	this.attributeInfo = aExprVect;
	this.compareValue = aExprVect;	
};

JdyOperatorExpression.prototype.visit = function (aVisitor){
	return aVisitor.visitOperatorExpression(this);
};

JdyOperatorExpression.prototype.matchesObject = function ( aModel ) {
		
	var modelValue = aModel.getValue(this.attributeInfo);
	return this.myOperator.compareValues(modelValue, this.compareValue, this.attributeInfo);
};

JdyOperatorExpression.prototype.getOperator = function ( ) {
		
	return this.myOperator;
};

export const JdyEqualOperator = function(notEqual){

	this.isNotEqual = (notEqual) ? true : false;
};

JdyEqualOperator.prototype.visitOperatorHandler = function (aVisitor){
	
	return aVisitor.visitEqualOperator(this);
};

JdyEqualOperator.prototype.compareValues = function ( value1, value2, attributeInfo ) {
		
    var result = false;
	if ( value1 !== null && value2 !== null) {
		result =  attributeInfo.compareObjects( value1, value2) === 0;
		if( isNotEqual) {
			result = !result;
		}
	}
	return result;
};

JdyEqualOperator.prototype.toString = function () {

    return (this.isNotEqual) ? "<>" : "=";
};

export const JdyGreatorOperator = function(alsoEqual){

    this.isAlsoEqual = (alsoEqual) ? true : false;
};

JdyGreatorOperator.prototype.visitOperatorHandler = function (aVisitor){
	
	return aVisitor.visitGreatorOperator(this);
};

JdyGreatorOperator.prototype.compareValues = function ( value1, value2, attributeInfo ) {
		
    var result = false;
	if ( value1 !== null && value2 !== null) {
		result =  attributeInfo.compareObjects( value1, value2) > 0;
		if( isAlsoEqual) {
			result =  result && attributeInfo.compareObjects( value1, value2) === 0;
		}
	}
	return result;
};

JdyGreatorOperator.prototype.toString = function () {

    return (this.isAlsoEqual) ? ">=" : ">";
};

export const JdyLessOperator = function(alsoEqual) {

    this.isAlsoEqual = (alsoEqual) ? true : false;
};

JdyLessOperator.prototype.visitOperatorHandler = function (aVisitor){
	
	return aVisitor.visitLessOperator(this);
};

JdyLessOperator.prototype.compareValues = function ( value1, value2, attributeInfo ) {
		
    var result = false;
	if ( value1 !== null && value2 !== null) {
		result =  attributeInfo.compareObjects( value1, value2) < 0;
		if( isAlsoEqual) {
			result =  result && attributeInfo.compareObjects( value1, value2) === 0;
		}
	}
	return result;
};

JdyLessOperator.prototype.toString = function () {

    return (this.isAlsoEqual) ? "<=" : "<";
};

export const JdyFilterCreationException = function (message) {
    this.name = "FilterCreationException";
    this.message = message || "FilterCreationException";
};

export const JdyQueryCreator = function(aResultInfo){

	this.resultInfo = aResultInfo;
	this.createdExpr = null;

};

JdyQueryCreator.prototype.query = function (){
	
	return new JdyClassInfoQuery(this.resultInfo, this.createdExpr);
};

JdyQueryCreator.prototype.greater = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyGreatorOperator());
	return this;
};

JdyQueryCreator.prototype.greaterOrEqual = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyGreatorOperator(true));
	return this;
};

JdyQueryCreator.prototype.less = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyLessOperator());
	return this;
};

JdyQueryCreator.prototype.lessOrEqual = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyLessOperator(true));
	return this;
};


JdyQueryCreator.prototype.equal = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyEqualOperator());
	return this;
};

JdyQueryCreator.prototype.notEqual = function ( anExAttrName, aCompareValue ) {
		
	this.addOperatorExpression(anExAttrName, aCompareValue, new JdyEqualOperator(true));
	return this;
};

JdyQueryCreator.prototype.addOperatorExpression = function ( anAttrName, aCompareValue, aOperator) {
		
	var opExpr = new JdyOperatorExpression();
	opExpr.attributeInfo = this.resultInfo.getAttr(anAttrName);
	opExpr.compareValue = aCompareValue;
	opExpr.myOperator = aOperator;
	this.addExpression(opExpr);
	return this;
};

JdyQueryCreator.prototype.addExpression = function ( anExpr ) {
		
	this.createdExpr = anExpr;
	return this;
};

JdyQueryCreator.prototype.and = function () {
		
	return new JdyAndQueryCreator(this.resultInfo, this);
};

JdyQueryCreator.prototype.or = function ( ) {
		
	return new JdyOrQueryCreator(this.resultInfo, this);
};

JdyQueryCreator.prototype.end = function () {
		
	throw new JdyFilterCreationException("No Multiple Expression open");
};


export const JdyAndQueryCreator = function (aResultInfo, aParentCreator) {

	JdyAttributeInfo.apply(this, arguments);
	this.resultInfo = aResultInfo;
	this.parentCreator = aParentCreator;
	this.expressions = [];
};

JDY.inherit(JdyAndQueryCreator, JdyQueryCreator);


JdyAndQueryCreator.prototype.addExpression = function ( anExpr ) {
		
	this.expressions.push(anExpr);
};


JdyAndQueryCreator.prototype.query = function (){
	
	throw new FilterCreationException("And not closes");
};


JdyAndQueryCreator.prototype.end = function () {
		
	this.parentCreator.addExpression(new JdyAndExpression(this.expressions));
	return this.parentCreator;
};

export const JdyOrQueryCreator = function (aResultInfo, aParentCreator) {

	JdyAttributeInfo.apply(this, arguments);
	this.resultInfo = aResultInfo;
	this.parentCreator = aParentCreator;
	this.expressions = [];
};

JDY.inherit(JdyOrQueryCreator, JdyQueryCreator);


JdyOrQueryCreator.prototype.addExpression = function ( anExpr ) {
		
	this.expressions.push(anExpr);
};


JdyOrQueryCreator.prototype.query = function (){
	
	throw new FilterCreationException("Or not closes");
};


JdyOrQueryCreator.prototype.end = function () {
		
	this.parentCreator.addExpression(new JdyOrExpression(this.expressions));
	return this.parentCreator;
};


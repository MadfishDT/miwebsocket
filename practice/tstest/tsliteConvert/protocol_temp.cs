
using TypeLite;

namespace Rhyme.ProtocolGenerator
{
	
	internal partial class ProtocolGenerator
	{
		public const string TS_DATA_TYPE_PATH = "TYPESCRIPT";
		public const string TS_ENUMDATA_TYPE_PATH = "Enums.ts";
		public const string TS_DEFINEDATA_TYPE_PATH = "Type.d.ts";

	

		public void GenerateTypeScriptByClientInterface()
		{
			var assembly = Assembly.Load("Common");
			var models = assembly.GetTypes();
			
			var generator = new TypeScriptFluent()
			  .WithConvertor<Guid>(c => "string");

			foreach (var model in models)
			{
				if(model.FullName.Contains("Rb.Services.Protocol"))
				generator.ModelBuilder.Add(model);
			}
			
			var targetPath = Path.Combine(TS_DATA_TYPE_PATH, "types");
			
			var tsEnumDefinitions = generator.Generate(TsGeneratorOutput.Enums);
			
			var tsClassDefinitions = generator.Generate(TsGeneratorOutput.Properties | TsGeneratorOutput.Fields);
			
			WriteFileToJsonFolder(targetPath, TS_DEFINEDATA_TYPE_PATH, tsClassDefinitions);
			WriteFileToJsonFolder(targetPath, TS_ENUMDATA_TYPE_PATH, tsEnumDefinitions);

		}
		

	}
}

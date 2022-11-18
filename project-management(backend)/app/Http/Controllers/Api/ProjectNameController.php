<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectNameResource;
use App\Models\ProjectName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Haruncpi\LaravelIdGenerator\IdGenerator;



class ProjectNameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $projectName = ProjectName::with('projectStatuses.projectDetail.projectStatus')->when(request()->q, function ($projectName) {
            $projectName = $projectName->where('name', 'like', '%' . request()->q . '%');
        })->orderBy('sequence')->paginate(5);

        //return with Api Resource
        return new ProjectNameResource(true, 'List Data Project Name', $projectName);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name'     => 'required|unique:project_names',
            'sequence'     => 'required|integer|unique:project_names',
            'required_file' => 'required|boolean',

        ]);



        if ($validator->fails()) {

            return response()->json($validator->errors(), 422);
        }

        // $id = IdGenerator::generate(['table' => 'project_names', 'length' => 5, 'prefix' => '0']);

        //create projectName

        // $projectName = new ProjectName();

        // $projectName->project_name_id = $id;
        // $projectName->name = $$request->name;
        // $projectName->sequence = $request->sequence;
        // $projectName->required_file = $id;

        $projectName = ProjectName::create([
            // 'id' => $id,

            'name' => $request->name,

            'sequence' => $request->sequence,

            'required_file' => $request->required_file,

        ]);



        if ($projectName) {

            //return success with Api Resource

            return new ProjectNameResource(true, 'Data Project Name Berhasil Disimpan!', $projectName);
        }



        //return failed with Api Resource

        return new ProjectNameResource(false, 'Data Project Name Gagal Disimpan!', null);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $projectName = ProjectName::with('projectStatuses')->whereId($id)->first();

        if ($projectName) {
            return new ProjectNameResource(true, 'Detail data Project Name', $projectName);
        }

        return new ProjectNameResource(true, 'Detail data project name tidak ditemukan', null);
    }

    

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectName $projectName)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:project_names,name,' . $projectName->id,
            'sequence' => 'required|integer|unique:project_names,sequence,' . $projectName->id,
            'required_file' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //update projectName withour image
        $projectName->update([
            'name' => $request->name,
            'sequence' => $request->sequence,
            'required_file' => $request->required_file,
        ]);

        if ($projectName) {
            return new ProjectNameResource(true, 'Data project Name berhasil di update', $projectName); # code...
        }

        return new ProjectNameResource(false, 'Data project Name gagal di update', null);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectName $projectName)
    {
        if ($projectName->delete()) {
            return new ProjectNameResource(true, 'Data project Name berhasil di hapus', null);
        }
        else{
            return response()->json(['errors' => "Cannot delete project"], 422);
        }

        return new ProjectNameResource(false, 'Data project Name gagal di hapus', null);
    }
}
